import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Linking,
  Modal,
} from 'react-native';
import useSettingsStore from '../../stores/settingsStore';
import useIAP, { PRODUCT_DETAILS, IAP_PRODUCTS } from '../../hooks/useIAP';
import { PRESET_ACTS } from '../../lib/presets/kindness';

export default function SettingsScreen() {
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [newPresetText, setNewPresetText] = useState('');
  
  const {
    customPresets,
    hiddenPresetIds,
    notificationEnabled,
    isDonor,
    loadSettings,
    addCustomPreset,
    removeCustomPreset,
    togglePresetVisibility,
    setNotificationEnabled,
    setDonor,
  } = useSettingsStore();

  const {
    isPurchasing,
    purchaseHistory,
    purchaseProduct,
    restorePurchases,
  } = useIAP();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // 구매 내역이 있으면 후원자로 설정
    if (purchaseHistory.length > 0 && !isDonor) {
      setDonor(true);
    }
  }, [purchaseHistory]);

  const handleAddPreset = () => {
    if (newPresetText.trim()) {
      addCustomPreset(newPresetText.trim());
      setNewPresetText('');
      setShowPresetModal(false);
    }
  };

  const handleDeletePreset = (id: string) => {
    Alert.alert(
      '프리셋 삭제',
      '이 프리셋을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: () => removeCustomPreset(id), style: 'destructive' },
      ]
    );
  };

  const allPresets = [...PRESET_ACTS, ...customPresets];

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ 설정</Text>
          {isDonor && (
            <View style={styles.donorBadge}>
              <Text style={styles.donorText}>💖 후원자</Text>
            </View>
          )}
        </View>

        {/* 프리셋 관리 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프리셋 관리</Text>
          
          {allPresets.map(preset => (
            <View key={preset.id} style={styles.presetItem}>
              <Text style={[
                styles.presetLabel,
                hiddenPresetIds.includes(preset.id) && styles.hiddenPreset
              ]}>
                {preset.label}
              </Text>
              
              <View style={styles.presetActions}>
                <TouchableOpacity
                  onPress={() => togglePresetVisibility(preset.id)}
                >
                  <Text style={styles.actionButton}>
                    {hiddenPresetIds.includes(preset.id) ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
                
                {preset.id.startsWith('custom_') && (
                  <TouchableOpacity
                    onPress={() => handleDeletePreset(preset.id)}
                  >
                    <Text style={styles.deleteButton}>삭제</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowPresetModal(true)}
          >
            <Text style={styles.addButtonText}>+ 프리셋 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>매일 알림 받기</Text>
            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{ false: '#E5E7EB', true: '#FF8A65' }}
              thumbColor={notificationEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* 개발자 후원 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>☕ 개발자 후원하기</Text>
          <Text style={styles.supportText}>
            앱이 마음에 드신다면, 개발자에게 작은 후원을 해주세요!
          </Text>
          
          <View style={styles.iapProducts}>
            <TouchableOpacity
              style={styles.iapItem}
              onPress={() => purchaseProduct(IAP_PRODUCTS.COFFEE_SMALL)}
              disabled={isPurchasing}
            >
              <Text style={styles.iapTitle}>☕ 커피 한 잔</Text>
              <Text style={styles.iapPrice}>₩1,100</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iapItem}
              onPress={() => purchaseProduct(IAP_PRODUCTS.COFFEE_MEDIUM)}
              disabled={isPurchasing}
            >
              <Text style={styles.iapTitle}>☕☕ 커피 두 잔</Text>
              <Text style={styles.iapPrice}>₩2,200</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iapItem}
              onPress={() => purchaseProduct(IAP_PRODUCTS.MEAL_SMALL)}
              disabled={isPurchasing}
            >
              <Text style={styles.iapTitle}>🍚 따뜻한 밥 한 끼</Text>
              <Text style={styles.iapPrice}>₩5,500</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.restoreButton}
            onPress={restorePurchases}
          >
            <Text style={styles.restoreText}>구매 내역 복원</Text>
          </TouchableOpacity>
        </View>

        {/* 앱 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={() => Linking.openURL('https://example.com/privacy')}
          >
            <Text style={styles.infoLabel}>개인정보 처리방침</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={() => Linking.openURL('https://example.com/terms')}
          >
            <Text style={styles.infoLabel}>이용약관</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>문의</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:support@example.com')}
            >
              <Text style={styles.emailLink}>support@example.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* 프리셋 추가 모달 */}
      <Modal
        visible={showPresetModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPresetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>새 프리셋 추가</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="프리셋 이름 입력"
              value={newPresetText}
              onChangeText={setNewPresetText}
              autoFocus
              maxLength={20}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewPresetText('');
                  setShowPresetModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddPreset}
              >
                <Text style={styles.confirmButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  donorBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  donorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  presetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  presetLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  hiddenPreset: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  presetActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    fontSize: 20,
  },
  deleteButton: {
    color: '#EF4444',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  supportText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
    lineHeight: 20,
  },
  iapProducts: {
    gap: 10,
  },
  iapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  iapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  iapPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8A65',
  },
  restoreButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  restoreText: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  infoValue: {
    fontSize: 16,
    color: '#6B7280',
  },
  arrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  emailLink: {
    fontSize: 14,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#FF8A65',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});