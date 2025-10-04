import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Modal,
} from 'react-native';
import useKindnessStore from '../../stores/kindnessStore';
import useSettingsStore from '../../stores/settingsStore';
import { PRESET_ACTS } from '../../lib/presets/kindness';
import { initDatabase } from '../../lib/db/database';
import { getRandomMessage, getStreakMessage } from '../../lib/messages';
import { getToday } from '../../lib/utils';
import ShareCard from '../../components/share/ShareCard';

export default function TodayScreen() {
  const [text, setText] = useState('');
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastKindness, setLastKindness] = useState<any>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  const { streak, byDate, todayKindness, addKindness, loadKindnesses } = useKindnessStore();
  const { customPresets, hiddenPresetIds, loadSettings } = useSettingsStore();

  useEffect(() => {
    initDatabase().then(() => {
      loadKindnesses();
      loadSettings();
    });
  }, []);

  // 보여질 프리셋 계산
  const allPresets = [...PRESET_ACTS, ...customPresets];
  const visiblePresets = allPresets.filter(
    preset => !hiddenPresetIds.includes(preset.id)
  );

  const togglePreset = (id: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedPresets(prev =>
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const showEncouragement = (message: string) => {
    setEncouragementMessage(message);
    setShowMessage(true);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowMessage(false));
    }, 3000);
  };

  const handleRecord = async () => {
    if (!text && selectedPresets.length === 0) {
      Alert.alert('알림', '오늘의 선행을 입력해주세요!');
      return;
    }

    const today = getToday();
    const newKindness = {
      date: today,
      text: text || undefined,
      presetIds: selectedPresets.length > 0 ? selectedPresets : undefined,
    };
    
    await addKindness(newKindness);
    
    setLastKindness({
      ...newKindness,
      presets: selectedPresets.map(id => {
        const preset = allPresets.find(p => p.id === id);
        return preset?.label || id;
      }),
    });

    // 연속일 메시지 체크
    const streakMessage = getStreakMessage(streak + 1);
    const message = streakMessage || getRandomMessage();
    showEncouragement(message);

    setText('');
    setSelectedPresets([]);
  };

  const openShareModal = () => {
    if (!lastKindness && !todayKindness) {
      Alert.alert('알림', '먼저 오늘의 선행을 기록해주세요!');
      return;
    }
    setShowShareModal(true);
  };

  const todayData = byDate[getToday()]?.[0];
  const shareData = lastKindness || (todayData && {
    text: todayData.text || '오늘도 선행을 실천했어요!',
    presets: todayData.presetIds?.map(id => {
      const preset = allPresets.find(p => p.id === id);
      return preset?.label || id;
    }) || [],
  });

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🌼 차카게살자</Text>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.streak}>🔥 연속 {streak}일</Text>
          </Animated.View>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="오늘의 선행을 입력하세요"
            value={text}
            onChangeText={setText}
            multiline
            editable={!todayKindness}
          />

          <View style={styles.presets}>
            {visiblePresets.map(preset => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.chip,
                  selectedPresets.includes(preset.id) && styles.chipSelected
                ]}
                onPress={() => togglePreset(preset.id)}
                disabled={!!todayKindness}
              >
                <Text style={[
                  styles.chipText,
                  selectedPresets.includes(preset.id) && styles.chipTextSelected
                ]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.button, todayKindness && styles.buttonDisabled]}
            onPress={handleRecord}
            disabled={!!todayKindness}
          >
            <Text style={styles.buttonText}>
              {todayKindness ? '오늘 이미 기록했어요! ✅' : '기록하기'}
            </Text>
          </TouchableOpacity>

          {(lastKindness || todayKindness) && (
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={openShareModal}
            >
              <Text style={styles.shareButtonText}>📤 공유 카드 만들기</Text>
            </TouchableOpacity>
          )}

          {showMessage && (
            <Animated.View 
              style={[
                styles.message,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.messageText}>
                {encouragementMessage}
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* 공유 모달 */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            
            {shareData && (
              <ShareCard
                date={getToday()}
                text={shareData.text || '오늘도 선행을 실천했어요!'}
                streak={streak}
                presets={shareData.presets}
              />
            )}
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
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  streak: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8A65',
    marginTop: 10,
  },
  inputSection: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#FF8A65',
    borderColor: '#FF8A65',
  },
  chipText: {
    color: '#6B7280',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#FF8A65',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#66BB6A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF8A65',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  shareButtonText: {
    color: '#FF8A65',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  messageText: {
    textAlign: 'center',
    color: '#92400E',
    fontSize: 16,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: '#6B7280',
  },
});