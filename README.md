# 차카게살자 - One act of kindness a day 🌼

매일 하나의 선행을 기록하고 공유하는 따뜻한 습관 만들기 앱

## 📱 소개

"차카게살자"는 일상 속 작은 친절을 기록하며 더 나은 사람이 되어가는 여정을 도와주는 앱입니다. 
매일의 선행을 간단히 기록하고, 연속 실천일을 추적하며, 따뜻한 격려를 받아보세요.

## ✨ 주요 기능

- **📝 10초 간단 기록**: 텍스트 입력 또는 프리셋 선택으로 빠른 기록
- **🔥 연속일 추적**: 선행 실천 스트릭을 한눈에 확인
- **💬 따뜻한 격려**: 기록할 때마다 받는 맞춤형 응원 메시지
- **🎨 공유 카드**: SNS에 공유 가능한 예쁜 이미지 카드 생성
- **📅 달력 뷰**: 월별 선행 기록을 달력으로 확인
- **⚙️ 커스텀 프리셋**: 나만의 선행 항목 추가/관리
- **☕ 개발자 후원**: 인앱 구매로 개발자 응원하기

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- Expo CLI
- iOS 시뮬레이터 (Mac) 또는 Android 에뮬레이터

### 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/thisandthatstudio/kindness-app.git
cd kindness-app

# 의존성 설치
npm install

# Expo 개발 서버 시작
npx expo start

# iOS 실행 (Mac only)
npx expo run:ios

# Android 실행
npx expo run:android
```

## 🛠 기술 스택

- **Frontend**: React Native / Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Database**: SQLite (expo-sqlite)
- **UI Components**: Custom Components
- **Image Sharing**: react-native-view-shot, expo-sharing

## 📁 프로젝트 구조

```
kindness-app/
├── app/                    # Expo Router 스크린
│   ├── (tabs)/            # 탭 네비게이션
│   │   ├── index.tsx      # 오늘 탭
│   │   ├── history.tsx    # 기록 탭
│   │   └── settings.tsx   # 설정 탭
│   └── _layout.tsx        # 루트 레이아웃
├── components/            # 재사용 컴포넌트
│   └── share/
│       └── ShareCard.tsx  # 공유 카드 컴포넌트
├── hooks/                 # 커스텀 훅
│   └── useIAP.ts         # 인앱 구매 훅
├── lib/                   # 유틸리티
│   ├── db/               # 데이터베이스
│   ├── presets/          # 프리셋 데이터
│   ├── messages.ts       # 격려 메시지
│   └── utils.ts          # 유틸 함수
└── stores/               # Zustand 스토어
    ├── kindnessStore.ts  # 선행 기록 상태
    └── settingsStore.ts  # 설정 상태
```

## 📸 스크린샷

<div align="center">
  <img src="screenshots/home.jpg" width="250" alt="홈 화면">
  <img src="screenshots/sharecard.jpg" width="250" alt="공유 카드 화면">
</div>



## 📄 라이센스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👨‍💻 개발자

**This & That Studio**
- GitHub: [@thisandthatstudio](https://github.com/thisandthatstudio)
- Email: [thisandthatstudio.official@gmail.com](mailto:thisandthatstudio.official@gmail.com)
