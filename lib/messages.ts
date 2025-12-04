import i18n, { t } from './i18n';
import { ko } from './i18n/locales/ko';
import { en } from './i18n/locales/en';
import { zh } from './i18n/locales/zh';

const localeMessages = {
  ko: ko.messages,
  en: en.messages,
  zh: zh.messages,
};

// 랜덤 격려 메시지 가져오기
export const getRandomMessage = (): string => {
  const locale = i18n.getLocale();
  const messages = localeMessages[locale]?.encouragement || localeMessages['ko'].encouragement;
  
  if (Array.isArray(messages) && messages.length > 0) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  return '당신 덕분에 오늘이 조금 더 따뜻해졌어요.';
};

// 연속일에 따른 메시지
export const getStreakMessage = (streak: number): string | null => {
  const locale = i18n.getLocale();
  const messages = localeMessages[locale] || localeMessages['ko'];
  
  const streakKeys: Record<number, keyof typeof messages> = {
    3: 'streak3',
    7: 'streak7',
    14: 'streak14',
    30: 'streak30',
    100: 'streak100',
  };

  const key = streakKeys[streak];
  if (!key) return null;
  
  const message = messages[key];
  return typeof message === 'string' ? message : null;
};