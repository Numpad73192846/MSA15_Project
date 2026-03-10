# React 중심 구조 전환 가이드 (teamproject)

## 1) 현재 구조 분석 (현 상태)

리포지토리 루트(`c:\kkh\teamproject`)에 아래 2개 앱이 공존합니다.

- **Backend (Spring Boot)**: `teamproject/`
  - 빌드: `build.gradle` (Spring Boot 3.5.x, Java 23)
  - View: `spring-boot-starter-thymeleaf` 사용
  - 정적 리소스: `teamproject/src/main/resources/static/` (`css/`, `js/`, `img/`)
  - 템플릿: `teamproject/src/main/resources/templates/`
  - 페이지 라우팅(SSR/템플릿 반환): `@Controller` 들이 `return "..."` 으로 템플릿을 반환
    - 예: `HomeController` (`/`, `/login`, `/guide`, `/game/korean` 등)
    - 예: `TutorsPageController` (`/tutors`, `/tutors/{id}`, `/tutor/dashboard`, `/tutor/register*`)
    - 예: `MyPageController` (`/mypage`, `/member/mypage`, `/tutor/mypage` 등)
    - 예: `AdminController` (`/admin`, `/admin/partial/{tab}`)
    - 예: `PaymentsController` (`/payments/toss/success`, `/payments/toss/fail`)
  - 보안: `SecurityConfig`
    - CORS 허용 origin에 `http://localhost:3000` / `http://localhost:8080` 등 등록
    - 경로 인가 룰: `/css/**`, `/js/**`, `/img/**`, `/uploads/**`, `/login`, `/join` 등 permit
    - JWT 필터 + OAuth2 로그인 혼합

- **Frontend (Vite + React)**: `teamproject-app/`
  - Vite dev 서버 proxy: `vite.config.js`에서 `/api`를 `http://localhost:8080`로 프록시
  - `react-router-dom` 사용 (현재 앱 라우팅 확장 가능)

핵심 포인트는 **현재 “페이지”는 대부분 Spring(Thymeleaf)이 담당**하고, React 앱은 별도 디렉토리로 존재한다는 점입니다.

---

## 2) 목표 정의: “React로 구조 변경”의 2가지 방식

React 중심으로 바꾸는 방식은 크게 2가지가 있습니다.

### A안) 프론트/백 완전 분리 (권장)

- **React(Vite)**: 모든 화면/라우팅 담당 (SPA)
- **Spring Boot**: `/api/**`만 제공 (REST API)
- 로그인/권한은 다음 중 택1
  - **JWT 기반 API 인증**(프론트가 토큰 보관/전송)
  - **OAuth2 로그인 후 프론트로 redirect + 토큰 발급**

장점
- 프론트 개발/배포 독립
- 화면은 React Router로 일관되게 관리
- Thymeleaf 제거 가능

주의
- 기존 Thymeleaf 템플릿 의존(서버에서 렌더링/모델 주입)을 React 데이터 패칭으로 바꿔야 함

### B안) Spring 안에 React 빌드 결과를 포함 (단일 배포)

- 개발 시: Vite dev 서버 + Spring API
- 배포 시: `teamproject-app/dist`를 Spring 정적 리소스에 포함하여 Spring이 SPA를 서빙

장점
- 단일 서버(8080)로 배포 가능
- 인프라 단순

주의
- 프론트 빌드 산출물 copy/서빙 설정 필요
- SPA fallback(새로고침 시) 라우팅 처리 필요

---

## 3) 권장 폴더 구조 (React 중심)

### 3.1 프론트엔드(React) 권장 구조

`teamproject-app/src`를 아래처럼 확장하는 것을 권장합니다.

- **`src/app/`**
  - `router/` : React Router 설정
  - `providers/` : AuthProvider, QueryClientProvider 등
  - `layouts/` : 공용 레이아웃(헤더/푸터/사이드바)
- **`src/pages/`**
  - 라우팅 단위 페이지 컴포넌트 (예: `HomePage`, `TutorListPage`)
- **`src/features/`**
  - 도메인별 UI/로직 묶음 (예: `auth/`, `tutors/`, `mypage/`, `admin/`, `payments/`)
- **`src/shared/`**
  - 재사용 컴포넌트/유틸/타입
  - `api/` : axios 인스턴스, 인터셉터
  - `ui/` : 공통 버튼/모달 등
  - `utils/`
  - `styles/`

예시

- `src/shared/api/httpClient.js`
- `src/features/auth/api/authApi.js`
- `src/features/tutors/api/tutorsApi.js`
- `src/pages/TutorListPage.jsx`
- `src/app/router/routes.jsx`

### 3.2 백엔드(Spring) 권장 구조

- `controller`
  - `...ApiController` 형태로 REST만 유지
- `service`, `mapper/repository`, `domain/dto` 유지
- `templates/`는 점진적 제거(최종 목표)
- `static/`는 프론트 내장(B안) 시에만 사용

---

## 4) 마이그레이션 방법 (추천 시나리오)

여기서는 **A안(완전 분리)** 기준으로 “가장 안전한 점진적 전환” 순서를 제안합니다.

### 4.1 1단계: API 경계 확정

- 화면을 반환하는 컨트롤러(`@Controller` + 템플릿 반환)와
- JSON을 반환하는 컨트롤러(`@RestController`)를 분리해서 관리

권장 규칙
- React에서 호출하는 엔드포인트는 **`/api/**` prefix**로 통일
- 인증/인가도 `/api/**` 기준으로 Security rule 정리

### 4.2 2단계: React 라우팅 설계 (기존 페이지 매핑)

현재 Spring 페이지 라우팅을 React Router 라우트로 옮깁니다.

예시 매핑
- `/` -> `HomePage`
- `/login` -> `LoginPage`
- `/tutors` -> `TutorListPage`
- `/tutors/:id` -> `TutorDetailPage`
- `/mypage` or `/member/mypage` -> `MemberMyPage`
- `/tutor/mypage` -> `TutorMyPage`
- `/admin` -> `AdminPage`
- `/payments/toss/success` -> `PaymentSuccessPage`

### 4.3 3단계: 데이터 주입 방식 변경(Thymeleaf Model -> API)

현재 템플릿 렌더링에서 `Model`로 주입하던 값들은 React에서 API로 조회하게 바꿉니다.

예
- `TutorsPageController.tutors()`가 `model.addAttribute("tutors", tutors)` 하던 것
  - -> `/api/tutors` 같은 API로 분리
  - -> React에서 `useEffect`/데이터 패칭으로 조회

### 4.4 4단계: 개발 환경 연결

현재 `vite.config.js`는 `/api`를 `http://localhost:8080`에 프록시합니다.

주의
- 지금 설정은 `rewrite`로 `/api` prefix를 제거합니다.
  - 프론트에서 `/api/users` 호출하면, 백엔드는 `/users`로 받습니다.
  - **백엔드가 실제로 `/api/**`를 쓰고 있다면 rewrite를 제거해야 합니다.**

권장
- 백엔드를 `/api/**`로 맞추고
- Vite proxy에서 rewrite 제거하여
  - 프론트: `/api/...`
  - 백엔드: `/api/...`
  - 로 일치시키는 것을 권장합니다.

### 4.5 5단계: SecurityConfig 정리

React SPA가 붙으면 아래가 자주 이슈입니다.

- **CORS**
  - Vite 기본 포트는 보통 `5173` 입니다.
  - 현재 허용 origin에 `3000`이 있는데 실제 dev 포트와 불일치 가능
- **CSRF**
  - API를 JWT로만 보호할 거면 CSRF는 보통 비활성/예외 처리
- **정적 리소스 허용**
  - A안이면 Spring이 정적 화면을 거의 서빙하지 않으므로 `/css/**`, `/js/**` 허용 규칙은 축소 가능

---

## 5) 배포 방식

### A안(분리) 배포

- React: 정적 호스팅(Netlify/S3/CloudFront 등) 또는 별도 Nginx
- Spring: API 서버

필수
- CORS를 배포 도메인으로 제한
- OAuth2 redirect URI 정리

### B안(통합) 배포

- 빌드 결과(`teamproject-app/dist`)를 Spring이 서빙
- SPA fallback 라우팅(예: `/tutors/123` 직접 접근) 처리 필요

---

## 6) 체크리스트

- [ ] 어떤 방식으로 갈지 결정: **A안(분리)** vs **B안(통합)**
- [ ] 기존 Thymeleaf 페이지 목록(라우트) 확정
- [ ] `/api/**` prefix 통일 여부 결정
- [ ] Vite proxy rewrite 정책 정리
- [ ] CORS dev origin(예: `http://localhost:5173`) 추가
- [ ] 로그인/권한(JWT/OAuth2) 프론트 연동 방식 확정

---

## 7) 다음에 내가 바로 도와줄 수 있는 것

- 현재 백엔드가 실제로 `/api/**`를 쓰는지 확인해서
  - Vite proxy(`rewrite`)를 유지할지/제거할지 결정
- Spring에서 Thymeleaf 렌더링을 단계적으로 제거하도록
  - 페이지 컨트롤러를 SPA 진입점(예: `index.html`)로 바꾸는 설계(B안)
  - 혹은 페이지 컨트롤러 자체를 제거하는 설계(A안)

원하는 목표(A/B)랑 “최종 배포를 한 서버(8080)로 할지”만 알려주면, 그 기준으로 이 문서를 더 구체화하고 실제 설정/코드 변경까지 이어서 진행할 수 있어요.
