import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 인앱 구매 상품 정의
export const IAP_PRODUCTS = {
  COFFEE_SMALL: Platform.select({
    ios: 'com.yourcompany.kindnessapp.coffee.small',
    android: 'coffee_small',
  }) || '',
  COFFEE_MEDIUM: Platform.select({
    ios: 'com.yourcompany.kindnessapp.coffee.medium',
    android: 'coffee_medium',
  }) || '',
  MEAL_SMALL: Platform.select({
    ios: 'com.yourcompany.kindnessapp.meal.small',
    android: 'meal_small',
  }) || '',
};

export const PRODUCT_DETAILS = {
  [IAP_PRODUCTS.COFFEE_SMALL]: {
    title: '커피 한 잔 ☕',
    description: '개발자에게 커피 한 잔 사주기',
    price: '₩1,100',
  },
  [IAP_PRODUCTS.COFFEE_MEDIUM]: {
    title: '커피 두 잔 ☕☕',
    description: '개발자에게 커피 두 잔 사주기',
    price: '₩2,200',
  },
  [IAP_PRODUCTS.MEAL_SMALL]: {
    title: '따뜻한 밥 한 끼 🍚',
    description: '개발자에게 밥 한 끼 사주기',
    price: '₩5,500',
  },
};

// 모킹된 IAP Hook (실제 구매 없이 시뮬레이션)
export default function useIAP() {
  const [products, setProducts] = useState<any[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true); // 모킹이므로 항상 true

  useEffect(() => {
    initializeIAP();
    loadPurchaseHistory();
  }, []);

  const initializeIAP = async () => {
    try {
      // 모킹: 상품 정보 시뮬레이션
      const mockProducts = Object.keys(IAP_PRODUCTS).map(key => ({
        productId: IAP_PRODUCTS[key as keyof typeof IAP_PRODUCTS],
        ...PRODUCT_DETAILS[IAP_PRODUCTS[key as keyof typeof IAP_PRODUCTS]],
      }));
      
      setProducts(mockProducts);
      setIsConnected(true);
      
      console.log('IAP 모킹 모드: 실제 결제 없이 시뮬레이션됩니다.');
    } catch (error) {
      console.error('IAP 초기화 실패:', error);
      setIsConnected(false);
    }
  };

  const loadPurchaseHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('purchaseHistory');
      if (history) {
        setPurchaseHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('구매 내역 로드 실패:', error);
    }
  };

  const savePurchaseHistory = async (productId: string) => {
    try {
      const newHistory = [...purchaseHistory, productId];
      setPurchaseHistory(newHistory);
      await AsyncStorage.setItem('purchaseHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('구매 내역 저장 실패:', error);
    }
  };

  const showThankYouMessage = (productId: string) => {
    const product = PRODUCT_DETAILS[productId];
    const messages = [
      '정말 감사합니다! 💖',
      '당신의 마음이 따뜻하네요! 🌟',
      '덕분에 더 열심히 개발하겠습니다! 💪',
      '당신은 최고예요! 🎉',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    Alert.alert(
      '감사합니다! 🙏',
      `${product.title}를 후원해주셔서 감사합니다!\n\n${randomMessage}\n\n(테스트 모드: 실제 결제되지 않음)`,
      [{ text: '확인', style: 'default' }]
    );
  };

  const purchaseProduct = async (productId: string) => {
    if (!isConnected) {
      Alert.alert('연결 오류', '스토어에 연결할 수 없습니다.');
      return;
    }

    if (isPurchasing) {
      return;
    }

    setIsPurchasing(true);
    
    // 모킹: 구매 프로세스 시뮬레이션
    Alert.alert(
      '구매 확인',
      `${PRODUCT_DETAILS[productId].title}\n${PRODUCT_DETAILS[productId].price}\n\n(테스트 모드: 실제 결제되지 않음)`,
      [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => setIsPurchasing(false),
        },
        {
          text: '구매',
          onPress: async () => {
            // 2초 후 구매 완료 시뮬레이션
            setTimeout(async () => {
              await savePurchaseHistory(productId);
              showThankYouMessage(productId);
              setIsPurchasing(false);
            }, 1000);
          },
        },
      ]
    );
  };

  const restorePurchases = async () => {
    Alert.alert(
      '구매 복원',
      '테스트 모드에서는 구매 복원이 시뮬레이션됩니다.',
      [
        {
          text: '확인',
          onPress: async () => {
            // 모킹: 랜덤하게 구매 내역 복원 시뮬레이션
            if (Math.random() > 0.5) {
              const mockHistory = [IAP_PRODUCTS.COFFEE_SMALL];
              setPurchaseHistory(mockHistory);
              await AsyncStorage.setItem('purchaseHistory', JSON.stringify(mockHistory));
              Alert.alert('복원 완료', '구매 내역이 복원되었습니다. (테스트)');
            } else {
              Alert.alert('복원 실패', '복원할 구매 내역이 없습니다.');
            }
          },
        },
      ]
    );
  };

  return {
    products,
    isPurchasing,
    purchaseHistory,
    isConnected,
    purchaseProduct,
    restorePurchases,
  };
}