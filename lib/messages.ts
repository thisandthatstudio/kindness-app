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