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