// 날짜 포맷팅 (로컬 시간대 기준)
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 오늘 날짜 가져오기 (로컬 시간대 기준)
export const getToday = (): string => {
  return formatDate(new Date());
};

// 날짜 문자열을 Date 객체로
export const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
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
  let currentDate = parseDate(startDate);
  
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