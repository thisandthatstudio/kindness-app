import { useState, useEffect, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../lib/i18n';

// Try to import expo-iap, but handle gracefully if not available
let useExpoIAP: any = null;
let isIAPAvailable = false;

try {
  const expoIap = require('expo-iap');
  useExpoIAP = expoIap.useIAP;
  isIAPAvailable = true;
} catch (e) {
  console.log('expo-iap not available (Expo Go environment)');
  isIAPAvailable = false;
}

/**
 * 실제 스토어에 등록해야 하는 상품 ID
 * iOS: App Store Connect의 In-App Purchase Product ID
 * Android: Google Play Console의 Product ID
 */
export const IAP_PRODUCTS = {
  COFFEE: Platform.select({
    ios: 'com.thisandthatstudio.kindnessapp.coffee.1900',
    android: 'coffee_1900',
  }) || '',
  MEAL: Platform.select({
    ios: 'com.thisandthatstudio.kindnessapp.meal.6900',
    android: 'meal_6900',
  }) || '',
} as const;

/**
 * 로컬에서 쓰는 메타(표시용). 실제 가격은 스토어에서 가져온 displayPrice로 노출.
 */
export const PRODUCT_DETAILS: Record<string, { title: string; description: string; fallbackPrice: string }> = {
  [IAP_PRODUCTS.COFFEE]: {
    title: 'settings.coffeeTitle',
    description: 'settings.coffeeDesc',
    fallbackPrice: '₩1,900',
  },
  [IAP_PRODUCTS.MEAL]: {
    title: 'settings.mealTitle',
    description: 'settings.mealDesc',
    fallbackPrice: '₩6,900',
  },
};

const STORAGE_KEY = 'purchaseHistory';

// Mock hook for when expo-iap is not available
function useMockIAP() {
  return {
    connected: false,
    products: [],
    fetchProducts: async () => [],
    requestPurchase: async () => {},
    finishTransaction: async () => {},
    restorePurchases: async () => [],
  };
}

export default function useIAP() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<string[]>([]);
  const [iapError, setIapError] = useState<string | null>(null);

  // Use real IAP hook or mock based on availability
  const iapHook = isIAPAvailable && useExpoIAP ? useExpoIAP : useMockIAP;
  
  let iapResult: any = { connected: false, products: [] };
  
  try {
    if (isIAPAvailable && useExpoIAP) {
      iapResult = useExpoIAP({
        onPurchaseSuccess: async (purchase: any) => {
          try {
            const ok = true; // 데모: 서버 검증 생략

            if (!ok) {
              Alert.alert(t('alerts.purchaseFailed'), t('alerts.purchaseCancelled'));
              setIsPurchasing(false);
              return;
            }

            await iapResult.finishTransaction?.({
              purchase,
              isConsumable: true,
            });

            const pid = purchase?.productId || purchase?.productIds?.[0];
            if (pid) {
              const newHistory = [...purchaseHistory, pid];
              setPurchaseHistory(newHistory);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
            }

            Alert.alert(t('alerts.thankYou'), t('alerts.purchaseSuccess'));
          } catch (err) {
            console.error('finishTransaction error:', err);
            Alert.alert(t('alerts.purchaseFailed'), t('alerts.purchaseCancelled'));
          } finally {
            setIsPurchasing(false);
          }
        },
        onPurchaseError: (error: any) => {
          console.error('purchase error:', error);
          Alert.alert(t('alerts.purchaseFailed'), t('alerts.purchaseCancelled'));
          setIsPurchasing(false);
        },
      });
    }
  } catch (e) {
    console.log('IAP hook initialization failed:', e);
    setIapError('IAP not available');
  }

  const { connected = false, products = [], fetchProducts, requestPurchase, finishTransaction, restorePurchases: restoreFromStore } = iapResult;

  // 연결되면 스토어에서 상품 정보를 가져옴
  useEffect(() => {
    if (!connected || !fetchProducts) return;
    const skus = Object.values(IAP_PRODUCTS).filter(Boolean);
    fetchProducts({ skus, type: 'in-app' as any }).catch((e: any) =>
      console.error('fetchProducts error:', e),
    );
  }, [connected]);

  // 로컬 구매 내역 로드
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setPurchaseHistory(JSON.parse(saved));
      } catch (e) {
        console.error('load purchaseHistory error:', e);
      }
    })();
  }, []);

  const productsById = useMemo(() => {
    const map: Record<string, any> = {};
    for (const p of products ?? []) map[p.id] = p;
    return map;
  }, [products]);

  const isConnected = isIAPAvailable && connected;

  const purchaseProduct = async (productId: string) => {
    if (!isIAPAvailable) {
      Alert.alert(t('settings.title'), t('settings.purchaseNotAvailable'));
      return;
    }
    
    if (!isConnected) {
      Alert.alert(t('alerts.connectionError'), t('alerts.storeConnectionError'));
      return;
    }
    if (isPurchasing) return;

    setIsPurchasing(true);
    try {
      await requestPurchase?.({
        request: {
          ios: { sku: productId },
          android: { skus: [productId] },
        },
      });
    } catch (error) {
      console.error('requestPurchase error:', error);
      Alert.alert(t('alerts.purchaseFailed'), t('alerts.purchaseCancelled'));
      setIsPurchasing(false);
    }
  };

  const restorePurchases = async () => {
    if (!isIAPAvailable || !restoreFromStore) {
      Alert.alert(t('settings.title'), t('settings.purchaseNotAvailable'));
      return;
    }
    
    try {
      const restored = await restoreFromStore();
      const ids: string[] = [];
      for (const r of restored ?? []) {
        const pid = (r as any)?.productId || (r as any)?.productIds?.[0];
        if (pid) ids.push(pid);
      }
      if (ids.length) {
        const merged = Array.from(new Set([...purchaseHistory, ...ids]));
        setPurchaseHistory(merged);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        Alert.alert(t('alerts.restoreComplete'), t('alerts.restoreSuccess'));
      } else {
        Alert.alert(t('alerts.restoreResult'), t('alerts.noRestoreData'));
      }
    } catch (e) {
      console.error('restorePurchases error:', e);
      Alert.alert(t('alerts.restoreFailed'), t('alerts.restoreError'));
    }
  };

  return {
    // 스토어 상태/정보
    isConnected,
    isIAPAvailable,
    products,
    productsById,
    // 진행 상태
    isPurchasing,
    // 간단한 로컬 히스토리 (후원자 뱃지 판단 등에 활용)
    purchaseHistory,
    // 액션
    purchaseProduct,
    restorePurchases,
  };
}