# React 마이그레이션 완료 가이드

## 완료된 작업

### 1. React 앱 구조 생성
- ✅ React Router 설정 (`src/app/router/routes.jsx`)
- ✅ 메인 레이아웃 (`src/app/layouts/MainLayout.jsx`)
- ✅ 인증 컨텍스트 (`src/contexts/AuthContext.jsx`)
- ✅ axios HTTP 클라이언트 (`src/shared/api/httpClient.js`)

### 2. 페이지 컴포넌트 생성
- ✅ HomePage - 메인 페이지
- ✅ LoginPage - 로그인 (일반 로그인 + OAuth2)
- ✅ TutorListPage - 튜터 목록
- ✅ TutorDetailPage - 튜터 상세
- ✅ MyPagePage - 회원 마이페이지
- ✅ TutorMyPagePage - 튜터 마이페이지
- ✅ TutorDashboardPage - 튜터 대시보드
- ✅ AdminPage - 관리자 페이지

### 3. 백엔드 설정
- ✅ Spring SecurityConfig에 CORS `localhost:5173` 추가
- ✅ OAuth2 성공 핸들러를 React 프론트엔드로 redirect 설정
- ✅ Vite proxy 설정 수정 (`/api` rewrite 제거)

### 4. 정적 리소스
- ✅ 이미지 파일 복사 (`public/img/`)
- ✅ CSS 파일 복사 (`public/css/`)

## 실행 방법

### 개발 환경 (권장)

**1. Spring Boot 실행 (8080 포트)**
```bash
cd c:\kkh\teamproject\teamproject
.\gradlew.bat bootRun
```

**2. React Dev 서버 실행 (5173 포트)**
```bash
cd c:\kkh\teamproject\teamproject-app
npm run dev
```

**3. 브라우저에서 접속**
```
http://localhost:5173
```

## 주요 기능

### 인증
- **일반 로그인**: `/api/auth/login` 엔드포인트 사용
- **OAuth2 로그인**: Google, Kakao 지원
  - 성공 시 `http://localhost:5173/?oauth2=success`로 redirect
  - HttpOnly 쿠키로 세션 관리

### API 호출
- 모든 API는 `/api/**` prefix 사용
- `withCredentials: true`로 쿠키 자동 전송
- 401 응답 시 자동으로 `/login`으로 redirect

## 다음 단계 (추가 작업 필요)

### 1. 나머지 페이지 이관
현재 기본 페이지만 구현되었습니다. 추가로 필요한 페이지:
- 회원가입 페이지
- 튜터 등록 페이지 (register1, register2, register3)
- 가이드 페이지들 (guide, faq, contact, about, partnership)
- 게임 페이지
- 결제 페이지

### 2. API 엔드포인트 확인
React에서 호출하는 API가 실제로 존재하는지 확인:
- `/api/auth/me` - 현재 사용자 정보
- `/api/auth/login` - 로그인
- `/api/auth/logout` - 로그아웃
- `/api/tutors` - 튜터 목록
- `/api/tutors/{id}` - 튜터 상세
- `/api/bookings/my` - 내 예약 목록

### 3. Spring 페이지 컨트롤러 정리
기존 Thymeleaf 페이지 컨트롤러들을 단계적으로 제거:
- `HomeController`
- `TutorsPageController`
- `MyPageController`
- `AdminController`
- `PaymentsController`

### 4. 스타일링 개선
- 기존 `style.css`를 Tailwind CSS로 전환
- 컴포넌트별 스타일 정리

## 트러블슈팅

### CORS 에러
- Spring SecurityConfig에서 `localhost:5173` 허용 확인
- `withCredentials: true` 설정 확인

### API 404 에러
- Vite proxy 설정에서 rewrite 제거 확인
- 백엔드가 `/api/**` 경로로 API 제공하는지 확인

### OAuth2 redirect 실패
- OAuth2AuthenticationSuccessHandler에서 `http://localhost:5173` redirect 확인
- 브라우저 쿠키 설정 확인

## 파일 구조

```
teamproject-app/
├── public/
│   ├── img/          # 이미지 리소스
│   └── css/          # 기존 CSS
├── src/
│   ├── app/
│   │   ├── layouts/  # 레이아웃
│   │   └── router/   # 라우터 설정
│   ├── contexts/     # React Context
│   ├── pages/        # 페이지 컴포넌트
│   ├── shared/
│   │   └── api/      # HTTP 클라이언트
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```
