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