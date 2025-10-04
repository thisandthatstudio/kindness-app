# KindnessApp - 차카게살자 (One act of kindness a day)

📅 Generated: 2025-10-04 20:51:03

## 📱 Project Overview

React Native/Expo 기반 매일 선행 기록 앱
- 10초 간단 기록 (텍스트/프리셋/사진)
- 연속일(Streak) 추적
- 따뜻한 격려 메시지
- 공유 카드 생성
- 달력 뷰 & 기록 관리
- 인앱 구매 (개발자 후원)

## 📁 Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── history.tsx
│   │   ├── index.tsx
│   │   └── settings.tsx
│   ├── modals/
│   └── _layout.tsx
├── assets/
│   └── images/
├── components/
│   ├── cards/
│   ├── share/
│   │   └── ShareCard.tsx
│   └── ui/
├── hooks/
│   └── useIAP.ts
├── lib/
│   ├── db/
│   │   └── database.ts
│   ├── presets/
│   │   └── kindness.ts
│   ├── messages.ts
│   ├── types.ts
│   └── utils.ts
├── store_assets/
│   └── app_description.txt
├── stores/
│   ├── kindnessStore.ts
│   └── settingsStore.ts
├── app.json
├── babel.config.js
├── create_temp_icon.js
├── index.ts
├── metro.config.js
├── package.json
└── tsconfig.json

```

## 📄 Core Files

### 📌 package.json

- Size: 1,371 bytes
- Modified: 2025-10-04 20:41:51

```json
{
  "name": "kindness-app",
  "version": "1.0.0",
  "private": true,
  "main": "index.ts",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clear": "expo start -c",
    "prebuild": "expo prebuild",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "lint": "tsc --noEmit",
    "create-icons": "node create_temp_icon.js"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.1.0",
    "expo": "~54.0.0",
    "expo-constants": "~18.0.0",
    "expo-dev-client": "~6.0.0",
    "expo-file-system": "~19.0.0",
    "expo-haptics": "^15.0.0",
    "expo-iap": "^3.1.8",
    "expo-image-manipulator": "~14.0.0",
    "expo-image-picker": "~17.0.0",
    "expo-linking": "~8.0.0",
    "expo-router": "~6.0.0",
    "expo-sharing": "~14.0.0",
    "expo-sqlite": "^16.0.0",
    "expo-status-bar": "~3.0.0",
    "react": "19.1.0",
    "react-native": "0.81.4",
    "react-native-safe-area-context": "^5.6.0",
    "react-native-screens": "^4.16.0",
    "react-native-svg": "^15.12.0",
    "react-native-view-shot": "^4.0.3",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@types/react": "~19.1.0",
    "typescript": "~5.9.0"
  }
}
```

### 📌 app.json

- Size: 389 bytes
- Modified: 2025-10-04 17:54:44

```json
{
  "expo": {
    "name": "차카게살자",
    "slug": "kindness-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "scheme": "kindnessapp",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.kindnessapp"
    },
    "android": {
      "package": "com.yourcompany.kindnessapp"
    }
  }
}
```

### 📌 babel.config.js

- Size: 111 bytes
- Modified: 2025-10-04 17:50:59

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### 📌 index.ts

- Size: 27 bytes
- Modified: 2025-10-04 17:54:51

```typescript
import 'expo-router/entry';
```

### 📌 tsconfig.json

- Size: 188 bytes
- Modified: 2025-10-04 20:49:10

```json
{
  "compilerOptions": {
    "jsx": "react-native",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "extends": "expo/tsconfig.base"
}

```

### 📌 metro.config.js

- Size: 338 bytes
- Modified: 2025-10-04 20:48:55

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 한글 경로 관련 설정
config.resolver.sourceExts = [...config.resolver.sourceExts];
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;
```

### 📌 app/_layout.tsx

- Size: 197 bytes
- Modified: 2025-10-04 17:47:45

```typescriptreact
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### 📌 app/(tabs)/_layout.tsx

- Size: 728 bytes
- Modified: 2025-10-04 17:47:57

```typescriptreact
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: '오늘',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '기록',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
```

### 📌 app/(tabs)/index.tsx

- Size: 9,906 bytes
- Modified: 2025-10-04 18:06:47

```typescriptreact
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
```

### 📌 app/(tabs)/history.tsx

- Size: 7,200 bytes
- Modified: 2025-10-04 17:58:52

```typescriptreact
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import useKindnessStore from '../../stores/kindnessStore';
import { formatDate, getToday } from '../../lib/utils';
import { PRESET_ACTS } from '../../lib/presets/kindness';

export default function HistoryScreen() {
  const { byDate, loadKindnesses, removeKindness } = useKindnessStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadKindnesses();
  }, []);

  // 달력 데이터 생성
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = firstDay.getDay();
    
    const days = [];
    
    // 빈 날짜 채우기
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // 실제 날짜 채우기
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = formatDate(new Date(year, month, i));
      days.push({
        day: i,
        date: dateStr,
        hasKindness: !!byDate[dateStr]?.length,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedKindnesses = selectedDate ? byDate[selectedDate] || [] : [];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDeleteKindness = async (date: string, id: string) => {
    await removeKindness(date, id);
    if (byDate[date]?.length === 0) {
      setSelectedDate(null);
    }
  };

  const getPresetLabel = (id: string) => {
    return PRESET_ACTS.find(p => p.id === id)?.label || id;
  };

  return (
    <ScrollView style={styles.container}>
      {/* 월 네비게이션 */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.monthNav}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.monthNav}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      {/* 달력 그리드 */}
      <View style={styles.calendar}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.calendarDay,
              day?.hasKindness && styles.hasKindness,
              day?.date === selectedDate && styles.selectedDay,
              day?.date === getToday() && styles.today,
            ]}
            onPress={() => day?.hasKindness && setSelectedDate(day.date)}
            disabled={!day || !day.hasKindness}
          >
            {day && (
              <>
                <Text style={[
                  styles.dayNumber,
                  day.hasKindness && styles.hasKindnessText,
                ]}>
                  {day.day}
                </Text>
                {day.hasKindness && <Text style={styles.kindnessIcon}>🌼</Text>}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* 선택한 날짜의 기록 */}
      {selectedDate && selectedKindnesses.length > 0 && (
        <View style={styles.kindnessList}>
          <Text style={styles.listTitle}>{selectedDate}의 기록</Text>
          {selectedKindnesses.map(kindness => (
            <View key={kindness.id} style={styles.kindnessItem}>
              {kindness.text && (
                <Text style={styles.kindnessText}>{kindness.text}</Text>
              )}
              {kindness.presetIds && kindness.presetIds.length > 0 && (
                <View style={styles.presetTags}>
                  {kindness.presetIds.map(id => (
                    <Text key={id} style={styles.presetTag}>
                      {getPresetLabel(id)}
                    </Text>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteKindness(selectedDate, kindness.id)}
              >
                <Text style={styles.deleteText}>삭제</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  monthNav: {
    fontSize: 24,
    color: '#FF8A65',
    padding: 10,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayNumber: {
    fontSize: 16,
    color: '#1F2937',
  },
  hasKindness: {
    backgroundColor: '#FEF3C7',
  },
  hasKindnessText: {
    fontWeight: 'bold',
  },
  kindnessIcon: {
    fontSize: 10,
    position: 'absolute',
    bottom: 2,
  },
  selectedDay: {
    backgroundColor: '#FF8A65',
  },
  today: {
    borderColor: '#FF8A65',
    borderWidth: 2,
  },
  kindnessList: {
    padding: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F2937',
  },
  kindnessItem: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  kindnessText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  presetTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 8,
  },
  presetTag: {
    backgroundColor: '#66BB6A',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 14,
  },
});
```

### 📌 app/(tabs)/settings.tsx

- Size: 12,841 bytes
- Modified: 2025-10-04 18:03:34

```typescriptreact
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
```

### 📌 lib/types.ts

- Size: 237 bytes
- Modified: 2025-10-04 17:48:08

```typescript
export type Kindness = {
  id: string;
  date: string;         // 'YYYY-MM-DD'
  text?: string;
  presetIds?: string[];
  photoUri?: string;
  createdAt: number;
};

export type PresetAct = {
  id: string;
  label: string;
};
```

### 📌 lib/db/database.ts

- Size: 475 bytes
- Modified: 2025-10-04 17:48:29

```typescript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('kindness.db');

export const initDatabase = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS kindness (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      text TEXT,
      preset_ids TEXT,
      photo_uri TEXT,
      created_at INTEGER NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_kindness_date ON kindness(date);
  `);
};

export default db;
```

### 📌 lib/utils.ts

- Size: 1,609 bytes
- Modified: 2025-10-04 17:57:44

```typescript
// 날짜 포맷팅
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 오늘 날짜 가져오기
export const getToday = (): string => {
  return formatDate(new Date());
};

// 날짜 문자열을 Date 객체로
export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00');
};

// 두 날짜 사이의 일수 차이
export const daysBetween = (date1: string, date2: string): number => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// 연속일 계산 (더 정확한 버전)
export const calculateStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;
  
  const sortedDates = [...dates].sort().reverse();
  const today = getToday();
  
  // 오늘 기록이 없으면 어제부터 체크
  let startDate = today;
  if (sortedDates[0] !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    startDate = formatDate(yesterday);
    
    // 어제도 기록이 없으면 streak 0
    if (sortedDates[0] !== startDate) {
      return 0;
    }
  }
  
  let streak = 0;
  let currentDate = new Date(startDate);
  
  for (const date of sortedDates) {
    const expected = formatDate(currentDate);
    if (date === expected) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (date < expected) {
      break;
    }
  }
  
  return streak;
};
```

### 📌 lib/messages.ts

- Size: 1,256 bytes
- Modified: 2025-10-04 17:57:28

```typescript
// 기본 격려 문구
export const ENCOURAGEMENT_MESSAGES = [
  "당신 덕분에 오늘이 조금 더 따뜻해졌어요.",
  "작은 친절이 큰 변화를 만들어요.",
  "당신의 선행이 누군가에게 기쁨이 되었을 거예요.",
  "오늘도 멋진 하루를 만들어주셔서 감사해요.",
  "당신의 따뜻한 마음이 세상을 밝게 만들어요.",
  "한 걸음 한 걸음이 더 나은 세상을 만들어요.",
  "오늘의 작은 실천이 큰 울림이 될 거예요.",
];

// 연속일 달성 메시지
export const STREAK_MESSAGES: Record<number, string> = {
  3: "🎉 3일 연속! 습관이 되어가고 있어요!",
  7: "🌟 일주일 연속! 당신은 정말 대단해요!",
  14: "💫 2주 연속! 꾸준함이 빛을 발하네요!",
  30: "🏆 한 달 연속! 당신은 진정한 천사예요!",
  100: "👑 100일 연속! 전설이 되셨습니다!",
};

// 랜덤 메시지 가져오기
export const getRandomMessage = (): string => {
  return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
};

// 연속일에 따른 메시지
export const getStreakMessage = (streak: number): string | null => {
  return STREAK_MESSAGES[streak] || null;
};
```

### 📌 lib/presets/kindness.ts

- Size: 400 bytes
- Modified: 2025-10-04 17:48:19

```typescript
import { PresetAct } from '../types';

export const PRESET_ACTS: PresetAct[] = [
  { id: 'open_door',  label: '문 열어주기' },
  { id: 'pick_trash', label: '쓰레기 줍기' },
  { id: 'say_thanks', label: '고맙다고 말하기' },
  { id: 'give_seat',  label: '자리 양보하기' },
  { id: 'compliment', label: '칭찬하기' },
  { id: 'check_in',   label: '안부 묻기' },
];
```

### 📌 stores/kindnessStore.ts

- Size: 3,922 bytes
- Modified: 2025-10-04 20:38:12

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../lib/db/database';
import { Kindness } from '../lib/types';
import { calculateStreak, getToday } from '../lib/utils';

type DBKindnessRow = {
  id: string;
  date: string;
  text: string | null;
  preset_ids: string | null;
  photo_uri: string | null;
  created_at: number;
};

type KindnessState = {
  byDate: Record<string, Kindness[]>;
  streak: number;
  todayKindness: Kindness | null;
  
  loadKindnesses: () => Promise<void>;
  addKindness: (kindness: Omit<Kindness, 'id' | 'createdAt'>) => Promise<void>;
  removeKindness: (date: string, id: string) => Promise<void>;
  computeStreak: () => void;
};

const useKindnessStore = create<KindnessState>((set, get) => ({
  byDate: {},
  streak: 0,
  todayKindness: null,

  loadKindnesses: async () => {
    try {
      const result = await db.getAllAsync<DBKindnessRow>(
        'SELECT * FROM kindness ORDER BY date DESC, created_at DESC'
      );
      
      const byDate: Record<string, Kindness[]> = {};
      const today = getToday();
      let todayKindness: Kindness | null = null;
      
      result.forEach((row) => {
        const kindness: Kindness = {
          id: row.id,
          date: row.date,
          text: row.text || undefined,
          presetIds: row.preset_ids ? JSON.parse(row.preset_ids) : undefined,
          photoUri: row.photo_uri || undefined,
          createdAt: row.created_at,
        };
        
        if (!byDate[row.date]) {
          byDate[row.date] = [];
        }
        byDate[row.date].push(kindness);
        
        if (row.date === today && !todayKindness) {
          todayKindness = kindness;
        }
      });
      
      set({ byDate, todayKindness });
      get().computeStreak();
    } catch (error) {
      console.error('Failed to load kindnesses:', error);
      // 에러 발생 시 빈 상태로 초기화
      set({ byDate: {}, todayKindness: null, streak: 0 });
    }
  },

  addKindness: async (kindness) => {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = Date.now();
    const newKindness: Kindness = { ...kindness, id, createdAt };
    
    try {
      await db.runAsync(
        'INSERT INTO kindness (id, date, text, preset_ids, photo_uri, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          id, 
          kindness.date, 
          kindness.text || null, 
          kindness.presetIds ? JSON.stringify(kindness.presetIds) : null, 
          kindness.photoUri || null, 
          createdAt
        ]
      );
      
      const today = getToday();
      if (kindness.date === today) {
        set({ todayKindness: newKindness });
      }
      
      await get().loadKindnesses();
    } catch (error) {
      console.error('Failed to add kindness:', error);
      throw new Error('선행 기록 저장에 실패했습니다.');
    }
  },

  removeKindness: async (date: string, id: string) => {
    try {
      await db.runAsync('DELETE FROM kindness WHERE id = ?', [id]);
      
      const today = getToday();
      const { todayKindness } = get();
      
      // 오늘 기록한 것을 삭제하는 경우 todayKindness 초기화
      if (todayKindness?.id === id && date === today) {
        set({ todayKindness: null });
      }
      
      await get().loadKindnesses();
    } catch (error) {
      console.error('Failed to remove kindness:', error);
      throw new Error('선행 기록 삭제에 실패했습니다.');
    }
  },

  computeStreak: () => {
    const { byDate } = get();
    const dates = Object.keys(byDate).filter(date => byDate[date].length > 0);
    const streak = calculateStreak(dates);
    set({ streak });
  },
}));

export default useKindnessStore;
```

### 📌 stores/settingsStore.ts

- Size: 2,822 bytes
- Modified: 2025-10-04 18:02:46

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRESET_ACTS } from '../lib/presets/kindness';

type CustomPreset = {
  id: string;
  label: string;
  isHidden?: boolean;
};

type SettingsState = {
  customPresets: CustomPreset[];
  hiddenPresetIds: string[];
  notificationEnabled: boolean;
  notificationTime: string;
  isDonor: boolean;
  
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  addCustomPreset: (label: string) => void;
  removeCustomPreset: (id: string) => void;
  togglePresetVisibility: (id: string) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;
  setDonor: (isDonor: boolean) => void;
};

const useSettingsStore = create<SettingsState>((set, get) => ({
  customPresets: [],
  hiddenPresetIds: [],
  notificationEnabled: false,
  notificationTime: '20:00',
  isDonor: false,

  loadSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        set(parsed);
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  },

  saveSettings: async () => {
    try {
      const state = get();
      const toSave = {
        customPresets: state.customPresets,
        hiddenPresetIds: state.hiddenPresetIds,
        notificationEnabled: state.notificationEnabled,
        notificationTime: state.notificationTime,
        isDonor: state.isDonor,
      };
      await AsyncStorage.setItem('appSettings', JSON.stringify(toSave));
    } catch (error) {
      console.error('설정 저장 실패:', error);
    }
  },

  addCustomPreset: (label: string) => {
    const id = `custom_${Date.now()}`;
    set(state => ({
      customPresets: [...state.customPresets, { id, label }]
    }));
    get().saveSettings();
  },

  removeCustomPreset: (id: string) => {
    set(state => ({
      customPresets: state.customPresets.filter(p => p.id !== id)
    }));
    get().saveSettings();
  },

  togglePresetVisibility: (id: string) => {
    set(state => ({
      hiddenPresetIds: state.hiddenPresetIds.includes(id)
        ? state.hiddenPresetIds.filter(pid => pid !== id)
        : [...state.hiddenPresetIds, id]
    }));
    get().saveSettings();
  },

  setNotificationEnabled: (enabled: boolean) => {
    set({ notificationEnabled: enabled });
    get().saveSettings();
  },

  setNotificationTime: (time: string) => {
    set({ notificationTime: time });
    get().saveSettings();
  },

  setDonor: (isDonor: boolean) => {
    set({ isDonor });
    get().saveSettings();
  },
}));

export default useSettingsStore;
```

### 📌 components/share/ShareCard.tsx

- Size: 7,216 bytes
- Modified: 2025-10-04 20:48:44

```typescriptreact
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';  // legacy API 사용

interface ShareCardProps {
  date: string;
  text: string;
  streak: number;
  presets?: string[];
}

export default function ShareCard({ date, text, streak, presets = [] }: ShareCardProps) {
  const viewShotRef = useRef<ViewShot>(null);

  const captureAndShare = async () => {
    try {
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        Alert.alert('오류', '캡처 기능을 사용할 수 없습니다.');
        return;
      }
      
      // ViewShot으로 이미지 캡처
      const uri = await viewShotRef.current.capture();
      
      // 파일을 캐시 디렉토리로 복사
      const filename = `kindness-card-${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri
      });
      
      // 공유 가능 여부 확인
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: '차카게살자 - 오늘의 선행',
        });
        
        // 공유 후 임시 파일 삭제
        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        } catch (deleteError) {
          console.log('임시 파일 삭제 실패:', deleteError);
        }
      } else {
        Alert.alert('알림', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      Alert.alert('오류', '이미지 생성 또는 공유에 실패했습니다.');
    }
  };

  const formatDateKorean = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        style={styles.card}
        options={{ 
          format: 'png', 
          quality: 1,
          result: 'tmpfile' 
        }}
      >
        {/* 카드 헤더 */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>🌼 차카게살자</Text>
          <Text style={styles.date}>{formatDateKorean(date)}</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 연속 {streak}일</Text>
          </View>
        </View>

        {/* 졸라맨 그림 영역 */}
        <View style={styles.illustrationContainer}>
          <View style={styles.stickmanWrapper}>
            <Text style={styles.stickman}>😊</Text>
            <View style={styles.body}>
              <Text style={styles.bodyText}>|</Text>
              <Text style={styles.arms}>╱ ╲</Text>
              <Text style={styles.legs}>╱ ╲</Text>
            </View>
          </View>
          <Text style={styles.flower}>🌼</Text>
        </View>

        {/* 선행 텍스트 */}
        <View style={styles.content}>
          <Text style={styles.quote}>"</Text>
          <Text style={styles.mainText}>{text || '오늘도 선행을 실천했어요!'}</Text>
          <Text style={styles.quote}>"</Text>
          
          {presets && presets.length > 0 && (
            <View style={styles.presetContainer}>
              {presets.map((preset, index) => (
                <Text key={index} style={styles.presetTag}>
                  #{preset}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* 하단 메시지 */}
        <View style={styles.footer}>
          <Text style={styles.footerMessage}>작은 친절이 큰 변화를 만들어요</Text>
          <Text style={styles.watermark}>차카게살자 - One act of kindness a day</Text>
        </View>
      </ViewShot>

      {/* 공유 버튼 */}
      <TouchableOpacity style={styles.shareButton} onPress={captureAndShare}>
        <Text style={styles.shareButtonText}>📤 공유하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFEF7',
    padding: 30,
    margin: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFE4CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  streakBadge: {
    backgroundColor: '#FFF4ED',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD6B8',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8A65',
  },
  illustrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  stickmanWrapper: {
    alignItems: 'center',
  },
  stickman: {
    fontSize: 60,
  },
  body: {
    alignItems: 'center',
    marginTop: -15,
  },
  bodyText: {
    fontSize: 20,
    color: '#4B5563',
  },
  arms: {
    fontSize: 20,
    color: '#4B5563',
    marginTop: -10,
  },
  legs: {
    fontSize: 20,
    color: '#4B5563',
    marginTop: -5,
  },
  flower: {
    fontSize: 50,
    marginLeft: 20,
  },
  content: {
    marginVertical: 20,
    alignItems: 'center',
  },
  quote: {
    fontSize: 30,
    color: '#E5E7EB',
    position: 'absolute',
    top: -10,
  },
  mainText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1F2937',
    lineHeight: 28,
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  presetTag: {
    fontSize: 14,
    color: '#66BB6A',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  watermark: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  shareButton: {
    backgroundColor: '#FF8A65',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  shareButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
```

### 📌 hooks/useIAP.ts

- Size: 5,543 bytes
- Modified: 2025-10-04 18:10:26

```typescript
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
```

### 📌 store_assets/app_description.txt

- Size: 1,143 bytes
- Modified: 2025-10-04 18:06:00

```text
앱 이름: 차카게살자
슬로건: One act of kindness a day

짧은 설명 (80자):
매일 하나의 선행을 기록하고 공유하는 따뜻한 습관 만들기 앱

긴 설명 (4000자):
차카게살자는 매일 작은 선행을 실천하고 기록하는 습관을 만들어주는 앱입니다.

주요 기능:
✅ 10초 간단 기록 - 한 줄 텍스트와 프리셋으로 빠르게 기록
🔥 연속일 추적 - 선행 실천 연속일수를 한눈에 확인
💬 따뜻한 격려 - 기록할 때마다 받는 응원 메시지
📸 사진 첨부 - 오늘의 선행을 사진으로도 남기기
🎨 공유 카드 - 예쁜 이미지로 SNS에 공유
📅 달력 보기 - 월별로 선행 기록 확인
☕ 개발자 후원 - 커피 한 잔으로 응원하기

특징:
- 로그인 없이 바로 사용
- 개인정보 보호 (로컬 저장)
- 심플하고 직관적인 디자인
- 무료 사용, 광고 없음

작은 친절이 만드는 큰 변화,
오늘부터 차카게살자와 함께 시작해보세요!

키워드:
선행, 친절, 습관, 기록, 일기, 연속, 스트릭, 공유, 따뜻한, 긍정
```

## 📦 Additional Project Files

### 📄 create_temp_icon.js

```javascript
// 임시 아이콘 생성 스크립트
const fs = require('fs');
const path = require('path');

// assets/images 디렉토리 생성
const assetsDir = path.join(__dirname, 'assets');
const imagesDir = path.join(assetsDir, 'images');

// 디렉토리가 없으면 생성
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
  console.log('Created: assets directory');
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
  console.log('Created: assets/images directory');
}

// 간단한 플레이스홀더 PNG 이미지 생성
// 이것은 100x100 오렌지색 사각형입니다
const createPlaceholderPNG = (size = 100, color = '#FF8A65') => {
  // 간단한 1x1 픽셀 PNG (base64)
  // 실제 프로덕션에서는 적절한 아이콘을 사용해야 합니다
  const transparentPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  return Buffer.from(transparentPixel, 'base64');
};

// 이미지 파일 생성
const imageConfigs = [
  { name: 'icon.png', size: 1024 },
  { name: 'splash.png', size: 2048 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'favicon.png', size: 48 }
];

imageConfigs.forEach(config => {
  const filePath = path.join(imagesDir, config.name);
  
  try {
    // 파일이 이미 존재하는지 확인
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
    } else {
      // 플레이스홀더 이미지 생성 및 저장
      const imageBuffer = createPlaceholderPNG(config.size);
      fs.writeFileSync(filePath, imageBuffer);
      console.log(`Created: ${filePath} (${config.size}x${config.size})`);
    }
  } catch (error) {
    console.error(`Error creating ${config.name}:`, error.message);
  }
});

console.log('\n✅ Temporary icons created successfully!');
console.log('⚠️  Note: Replace these placeholder images with actual app icons before production.');
```

## 📊 Project Statistics

- Core files included: 21
- Additional files included: 1
- Total files documented: 22

## 🔧 Installation & Setup

### Package Info

- Name: kindness-app
- Version: 1.0.0
- Main: index.ts

### Scripts

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "clear": "expo start -c",
  "prebuild": "expo prebuild",
  "build:android": "eas build --platform android",
  "build:ios": "eas build --platform ios",
  "lint": "tsc --noEmit",
  "create-icons": "node create_temp_icon.js"
}
```

### Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^2.1.0",
  "expo": "~54.0.0",
  "expo-constants": "~18.0.0",
  "expo-dev-client": "~6.0.0",
  "expo-file-system": "~19.0.0",
  "expo-haptics": "^15.0.0",
  "expo-iap": "^3.1.8",
  "expo-image-manipulator": "~14.0.0",
  "expo-image-picker": "~17.0.0",
  "expo-linking": "~8.0.0",
  "expo-router": "~6.0.0",
  "expo-sharing": "~14.0.0",
  "expo-sqlite": "^16.0.0",
  "expo-status-bar": "~3.0.0",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "react-native-safe-area-context": "^5.6.0",
  "react-native-screens": "^4.16.0",
  "react-native-svg": "^15.12.0",
  "react-native-view-shot": "^4.0.3",
  "zustand": "^5.0.8"
}
```

### Dev Dependencies

```json
{
  "@babel/core": "^7.26.0",
  "@types/react": "~19.1.0",
  "typescript": "~5.9.0"
}
```

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Clear cache and start
npx expo start -c

# Android build
npx expo run:android

# iOS build (Mac only)
npx expo run:ios

# Production build with EAS
eas build --platform android --profile production
```

## ✨ Key Features

### 오늘 탭
- 선행 텍스트 입력
- 프리셋 빠른 선택
- 사진 첨부 (구현 예정)
- 격려 메시지 애니메이션
- 연속일 큰 숫자 표시

### 기록 탭
- 달력 뷰 (월별)
- 기록 있는 날 꽃 아이콘
- 날짜별 상세 기록 보기
- 기록 삭제 기능

### 설정 탭
- 커스텀 프리셋 추가/삭제
- 프리셋 숨기기/보이기
- 인앱 구매 (개발자 후원)
- 알림 설정
- 앱 정보

### 공유 기능
- 졸라맨 + 꽃 이미지 카드
- 텍스트 공유 모드
- SNS/카톡 공유

## 📝 TODO / Known Issues

- [ ] 사진 첨부 기능 완성
- [ ] 실제 인앱 구매 구현 (현재 모킹)
- [ ] 알림 기능 구현
- [ ] 데이터 백업/복원
- [ ] 졸라맨 이미지 생성
- [ ] 앱 아이콘 제작
- [ ] 스플래시 스크린
- [ ] 다크 모드 지원
