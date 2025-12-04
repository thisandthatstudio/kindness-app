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
import i18n, { t, Locale } from '../../lib/i18n';

export default function SettingsScreen() {
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [newPresetText, setNewPresetText] = useState('');
  const [, forceUpdate] = useState({});

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
    isConnected,
    isIAPAvailable,
    isPurchasing,
    products,
    productsById,
    purchaseHistory,
    purchaseProduct,
    restorePurchases,
  } = useIAP();

  useEffect(() => {
    const unsubscribe = i18n.subscribe(() => forceUpdate({}));
    loadSettings();
    i18n.loadLocale();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (purchaseHistory.length > 0 && !isDonor) setDonor(true);
  }, [purchaseHistory]);

  const handleAddPreset = () => {
    if (newPresetText.trim()) {
      addCustomPreset(newPresetText.trim());
      setNewPresetText('');
      setShowPresetModal(false);
    }
  };

  const handleDeletePreset = (id: string) => {
    Alert.alert(t('settings.deletePreset'), t('settings.deletePresetConfirm'), [
      { text: t('settings.cancel'), style: 'cancel' },
      { text: t('settings.delete'), onPress: () => removeCustomPreset(id), style: 'destructive' },
    ]);
  };

  const handleLanguageChange = async (locale: Locale) => {
    await i18n.setLocale(locale);
    setShowLanguageModal(false);
  };

  const getPresetLabel = (preset: { id: string; label: string }) => {
    const localeKey = `presets.${preset.id}`;
    const translated = t(localeKey);
    return translated !== localeKey ? translated : preset.label;
  };

  const allPresets = [...PRESET_ACTS, ...customPresets];

  const getDisplayPrice = (productId: string) => {
    const p = productsById[productId];
    const details = PRODUCT_DETAILS[productId];
    return p?.displayPrice || details?.fallbackPrice || '';
  };

  const currentLocale = i18n.getLocale();
  
  const getLanguageDisplayName = (locale: Locale): string => {
    switch (locale) {
      case 'ko': return '한국어';
      case 'en': return 'English';
      case 'zh': return '中文';
      default: return '한국어';
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ {t('settings.title')}</Text>
          <View style={styles.storeStatus}>
            <Text style={[styles.storeDot, { backgroundColor: isConnected ? '#22C55E' : '#F59E0B' }]} />
            <Text style={styles.storeStatusText}>
              {isConnected ? t('settings.storeConnected') : t('settings.storeConnecting')}
            </Text>
          </View>
          {isDonor && (
            <View style={styles.donorBadge}>
              <Text style={styles.donorText}>{t('settings.donor')}</Text>
            </View>
          )}
        </View>

        {/* 프리셋 관리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.presetManagement')}</Text>

          {allPresets.map((preset) => (
            <View key={preset.id} style={styles.presetItem}>
              <Text
                style={[
                  styles.presetLabel,
                  hiddenPresetIds.includes(preset.id) && styles.hiddenPreset,
                ]}
              >
                {getPresetLabel(preset)}
              </Text>

              <View style={styles.presetActions}>
                <TouchableOpacity onPress={() => togglePresetVisibility(preset.id)}>
                  <Text style={styles.actionButton}>
                    {hiddenPresetIds.includes(preset.id) ? '❌' : '✅'}
                  </Text>
                </TouchableOpacity>

                {preset.id.startsWith('custom_') && (
                  <TouchableOpacity onPress={() => handleDeletePreset(preset.id)}>
                    <Text style={styles.deleteButton}>{t('settings.delete')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={() => setShowPresetModal(true)}>
            <Text style={styles.addButtonText}>{t('settings.addPreset')}</Text>
          </TouchableOpacity>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notification')}</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('settings.dailyNotification')}</Text>
            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{ false: '#E5E7EB', true: '#FF8A65' }}
              thumbColor={notificationEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* 언어 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageLabel}>{t('settings.selectLanguage')}</Text>
            <Text style={styles.languageValue}>
              {getLanguageDisplayName(currentLocale)} ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* 개발자 후원 (IAP) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.supportDeveloper')}</Text>
          <Text style={styles.supportText}>{t('settings.supportText')}</Text>

          {!isIAPAvailable && (
            <Text style={styles.iapWarning}>{t('settings.purchaseNotAvailable')}</Text>
          )}

          {/* 커피 1,900원 */}
          <TouchableOpacity
            style={[styles.iapItem, !isIAPAvailable && styles.iapItemDisabled]}
            onPress={() => purchaseProduct(IAP_PRODUCTS.COFFEE)}
            disabled={isPurchasing || !isIAPAvailable}
          >
            <View>
              <Text style={styles.iapTitle}>{t('settings.coffeeTitle')}</Text>
              <Text style={styles.iapDesc}>{t('settings.coffeeDesc')}</Text>
            </View>
            <Text style={styles.iapPrice}>{getDisplayPrice(IAP_PRODUCTS.COFFEE)}</Text>
          </TouchableOpacity>

          {/* 밥 6,900원 */}
          <TouchableOpacity
            style={[styles.iapItem, !isIAPAvailable && styles.iapItemDisabled]}
            onPress={() => purchaseProduct(IAP_PRODUCTS.MEAL)}
            disabled={isPurchasing || !isIAPAvailable}
          >
            <View>
              <Text style={styles.iapTitle}>{t('settings.mealTitle')}</Text>
              <Text style={styles.iapDesc}>{t('settings.mealDesc')}</Text>
            </View>
            <Text style={styles.iapPrice}>{getDisplayPrice(IAP_PRODUCTS.MEAL)}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.restoreButton, !isIAPAvailable && styles.restoreButtonDisabled]} 
            onPress={restorePurchases}
            disabled={!isIAPAvailable}
          >
            <Text style={styles.restoreText}>{t('settings.restorePurchases')}</Text>
          </TouchableOpacity>
        </View>

        {/* 앱 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appInfo')}</Text>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL('https://thisandthatstud.io/privacy')}
          >
            <Text style={styles.infoLabel}>{t('settings.privacyPolicy')}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => Linking.openURL('https://thisandthatstud.io/terms')}
          >
            <Text style={styles.infoLabel}>{t('settings.terms')}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('settings.version')}</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('settings.contact')}</Text>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@thisandthatstud.io')}>
              <Text style={styles.emailLink}>contact@thisandthatstud.io</Text>
            </TouchableOpacity>
          </View>
        </View>

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
            <Text style={styles.modalTitle}>{t('settings.newPreset')}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder={t('settings.presetPlaceholder')}
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
                <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddPreset}
              >
                <Text style={styles.confirmButtonText}>{t('settings.add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 언어 선택 모달 */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>

            {i18n.getAvailableLocales().map((locale) => (
              <TouchableOpacity
                key={locale.code}
                style={[
                  styles.languageOption,
                  currentLocale === locale.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageChange(locale.code)}
              >
                <Text style={[
                  styles.languageOptionText,
                  currentLocale === locale.code && styles.languageOptionTextSelected,
                ]}>
                  {locale.name}
                </Text>
                {currentLocale === locale.code && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { marginTop: 15 }]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  storeStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  storeDot: { width: 8, height: 8, borderRadius: 4 },
  storeStatusText: { color: '#6B7280' },
  donorBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  donorText: { color: '#DC2626', fontSize: 14, fontWeight: 'bold' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 15 },
  presetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  presetLabel: { fontSize: 16, color: '#1F2937' },
  hiddenPreset: { color: '#9CA3AF', textDecorationLine: 'line-through' },
  presetActions: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  actionButton: { fontSize: 20 },
  deleteButton: { color: '#EF4444', fontSize: 14 },
  addButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  switchLabel: { fontSize: 16, color: '#1F2937' },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  languageLabel: { fontSize: 16, color: '#1F2937' },
  languageValue: { fontSize: 16, color: '#6B7280' },
  supportText: { fontSize: 14, color: '#6B7280', marginBottom: 15, lineHeight: 20 },
  iapWarning: { 
    fontSize: 12, 
    color: '#F59E0B', 
    marginBottom: 10, 
    fontStyle: 'italic',
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
  iapItemDisabled: {
    opacity: 0.5,
  },
  iapTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  iapDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  iapPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF8A65' },
  restoreButton: { marginTop: 10, alignItems: 'center' },
  restoreButtonDisabled: { opacity: 0.5 },
  restoreText: { color: '#6B7280', fontSize: 14, textDecorationLine: 'underline' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: { fontSize: 16, color: '#1F2937' },
  infoValue: { fontSize: 16, color: '#6B7280' },
  arrow: { fontSize: 20, color: '#9CA3AF' },
  emailLink: { fontSize: 14, color: '#3B82F6', textDecorationLine: 'underline' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 15, textAlign: 'center' },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F3F4F6' },
  cancelButtonText: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
  confirmButton: { backgroundColor: '#FF8A65' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageOptionSelected: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  languageOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  languageOptionTextSelected: {
    fontWeight: 'bold',
    color: '#FF8A65',
  },
  checkMark: {
    fontSize: 18,
    color: '#FF8A65',
    fontWeight: 'bold',
  },
});