# 청년 무역 인턴 그룹 미팅 설문 시스템

July 22, 2025 청년 무역 인턴 그룹 미팅을 위한 동적 다단계 설문 플랫폼입니다.

## 주요 기능

- 📍 **위치 선택**: 강남, 홍대, 한강, 신촌 중 모임 장소 선택
- 🎭 **사용자 아이덴티티**: MZ 스타일 닉네임을 가진 동물 이모지 아바타 시스템
- 🍽️ **음식 선택**: 한식, 양식, BBQ 등 다양한 음식 카테고리
- 🍻 **음료 선택**: 맥주, 소주, 와인, 커피 등 음료 옵션
- ⏰ **시간 선호도**: 시간대별 우선순위 설정
- 📊 **실시간 결과**: 설문 결과 시각화 및 레스토랑 추천
- 🔄 **중복 방지**: 닉네임 기반 중복 참여 방지

## 기술 스택

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **shadcn/ui** components (Radix UI 기반)
- **Tailwind CSS** for styling
- **TanStack Query** for server state management

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **TypeScript** with ES modules
- **Zod** for validation

## 프로젝트 구조

```
├── client/           # 프론트엔드 React 애플리케이션
├── server/           # 백엔드 Express 서버
├── shared/           # 프론트엔드/백엔드 공유 타입 및 스키마
└── README.md
```

## 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 데이터베이스 설정
```bash
npm run db:push
```

### 3. 개발 서버 실행
```bash
npm run dev
```

애플리케이션이 `http://localhost:5000`에서 실행됩니다.

## 데이터베이스 스키마

### 설문 응답 (survey_responses)
- 사용자 닉네임 및 아바타
- 위치 선호도
- 음식/음료 선택
- 시간 선호도 (우선순위 포함)

### 레스토랑 (restaurants)
- 레스토랑 정보 및 위치
- 음식 카테고리
- 평점 및 리뷰 수
- 거리 정보

## 주요 페이지

1. **설문 페이지** (`/survey`): 5단계 설문 진행
2. **결과 페이지** (`/results`): 통계 및 레스토랑 추천

## 디자인 컨셉

- **자연 치유 분위기**: 섬과 자연을 테마로 한 편안한 디자인
- **모바일 우선**: 반응형 디자인으로 모든 기기 지원
- **다크 테마**: 세련된 다크 배경과 밝은 콘텐츠 대비

## 배포

Replit에서 배포 버튼을 클릭하여 자동 배포가 가능합니다.

---

*청년 무역 인턴 그룹의 성공적인 미팅을 위해 제작되었습니다.*