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