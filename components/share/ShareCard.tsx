import React, { useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { t } from '../../lib/i18n';
import useKindnessStore from '../../stores/kindnessStore';

interface ShareCardProps {
  date: string;
  text: string;
  presets?: string[];
}

export default function ShareCard({ date, text, presets = [] }: ShareCardProps) {
  const viewShotRef = useRef<ViewShot>(null);
  
  // Store에서 직접 최신 streak 가져오기
  const streak = useKindnessStore(state => state.streak);

  const captureAndShare = async () => {
    try {
      if (!viewShotRef.current || !viewShotRef.current.capture) {
        Alert.alert(t('share.error'), t('share.captureError'));
        return;
      }
      
      const uri = await viewShotRef.current.capture();
      
      const filename = `kindness-card-${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri
      });
      
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: t('share.title'),
        });
        
        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        } catch (deleteError) {
          console.log('임시 파일 삭제 실패:', deleteError);
        }
      } else {
        Alert.alert(t('share.error'), t('share.shareNotAvailable'));
      }
    } catch (error) {
      console.error('공유 실패:', error);
      Alert.alert(t('share.error'), t('share.shareError'));
    }
  };

  const formatDateKorean = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <View style={styles.container}>
      {/* ViewShot 영역 - 흰색 배경과 패딩으로 테두리 포함 */}
      <ViewShot
        ref={viewShotRef}
        style={styles.captureArea}
        options={{ 
          format: 'png', 
          quality: 1,
          result: 'tmpfile' 
        }}
      >
        {/* 흰색 배경 래퍼 */}
        <View style={styles.cardWrapper}>
          {/* 실제 카드 */}
          <View style={styles.card}>
            {/* 카드 헤더 */}
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Image
                  source={require('../../assets/images/flower.png')}
                  style={styles.titleIcon}
                />
                <Text style={styles.appTitle}>{t('share.title')}</Text>
              </View>
              <Text style={styles.date}>{formatDateKorean(date)}</Text>
              <View style={styles.streakBadge}>
                <Image
                  source={require('../../assets/images/fire.png')}
                  style={styles.streakIcon}
                />
                <Text style={styles.streakText}>
                  {t('today.streak')} {streak}{t('today.days')}
                </Text>
              </View>
            </View>

            {/* 카드 이미지 영역 */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require('../../assets/images/card.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
            </View>

            {/* 선행 텍스트 */}
            <View style={styles.content}>
              <Text style={styles.quote}>"</Text>
              <Text style={styles.mainText}>{text || t('share.practiced')}</Text>
              <Text style={styles.quoteEnd}>"</Text>
              
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
              <Text style={styles.footerMessage}>{t('share.footerMessage')}</Text>
              <Text style={styles.watermark}>{t('share.watermark')}</Text>
            </View>
          </View>
        </View>
      </ViewShot>

      {/* 공유 버튼 */}
      <TouchableOpacity style={styles.shareButton} onPress={captureAndShare}>
        <Image
          source={require('../../assets/images/share.png')}
          style={styles.shareButtonIcon}
        />
        <Text style={styles.shareButtonText}>{t('share.shareButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  captureArea: {
    margin: 10,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#FFFEF7',
    padding: 30,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4ED',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD6B8',
  },
  streakIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8A65',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  cardImage: {
    width: 150,
    height: 150,
  },
  content: {
    marginVertical: 20,
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  quote: {
    fontSize: 40,
    color: '#E5E7EB',
    position: 'absolute',
    top: -20,
    left: 0,
  },
  quoteEnd: {
    fontSize: 40,
    color: '#E5E7EB',
    position: 'absolute',
    bottom: -20,
    right: 0,
  },
  mainText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1F2937',
    lineHeight: 28,
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
    overflow: 'hidden',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareButtonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});