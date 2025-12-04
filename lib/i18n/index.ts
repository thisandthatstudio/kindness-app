import AsyncStorage from '@react-native-async-storage/async-storage';
import { ko } from './locales/ko';
import { en } from './locales/en';
import { zh } from './locales/zh';

export type Locale = 'ko' | 'en' | 'zh';

export type Translations = typeof ko;

const translations: Record<Locale, Translations> = {
  ko,
  en,
  zh,
};

let currentLocale: Locale = 'ko';
let listeners: (() => void)[] = [];

export const i18n = {
  t: (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLocale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Korean if key not found
        value = translations['ko'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  },

  getLocale: (): Locale => currentLocale,

  setLocale: async (locale: Locale) => {
    currentLocale = locale;
    await AsyncStorage.setItem('appLocale', locale);
    listeners.forEach(listener => listener());
  },

  loadLocale: async () => {
    try {
      const saved = await AsyncStorage.getItem('appLocale');
      if (saved && (saved === 'ko' || saved === 'en' || saved === 'zh')) {
        currentLocale = saved;
        listeners.forEach(listener => listener());
      }
    } catch (error) {
      console.error('Failed to load locale:', error);
    }
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  getAvailableLocales: (): { code: Locale; name: string }[] => [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
  ],
};

export const t = i18n.t;
export default i18n;