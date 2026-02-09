# ============================================
# 🔮 내 손 안에 손금 - 소셜 로그인 설정 가이드
# ============================================

## 📌 목차
1. 카카오 로그인 설정
2. 네이버 로그인 설정  
3. 구글 로그인 설정
4. application.properties 설정

---

## 1️⃣ 카카오 로그인 설정

### 1. 카카오 개발자 센터 접속
- URL: https://developers.kakao.com/

### 2. 애플리케이션 등록
1. 로그인 후 [내 애플리케이션] → [애플리케이션 추가하기]
2. 앱 이름: `내 손 안에 손금` (원하는 이름)
3. 사업자명: 본인 이름 또는 회사명

### 3. 앱 키 확인
- [앱 설정] → [앱 키]로 이동
- **REST API 키** 복사 → `client-id`로 사용

### 4. 카카오 로그인 활성화
1. [제품 설정] → [카카오 로그인] 이동
2. **활성화 설정**: ON
3. **Redirect URI 등록**:
   ```
   http://localhost:8080/login/oauth2/code/kakao
   ```

### 5. Client Secret 생성
1. [제품 설정] → [보안] 이동
2. **Client Secret**: 코드 생성 → 복사
3. **활성화 상태**: 사용함

### 6. 동의 항목 설정
1. [제품 설정] → [카카오 로그인] → [동의 항목]
2. 필수 설정:
   - 닉네임: 필수 동의
   - 프로필 사진: 선택 동의
   - 카카오계정(이메일): 선택 동의 (비즈앱 전환 필요할 수 있음)

### 7. 플랫폼 등록
1. [앱 설정] → [플랫폼]
2. Web 플랫폼 등록:
   - 사이트 도메인: `http://localhost:8080`

---

## 2️⃣ 네이버 로그인 설정

### 1. 네이버 개발자 센터 접속
- URL: https://developers.naver.com/

### 2. 애플리케이션 등록
1. [Application] → [애플리케이션 등록]
2. **애플리케이션 이름**: `내 손 안에 손금`
3. **사용 API**: 네이버 로그인 선택
4. **제공 정보 선택**:
   - 회원이름 (필수)
   - 이메일 (필수)
   - 프로필 사진 (추가)

### 3. 환경 설정
1. **환경 추가**: PC 웹
2. **서비스 URL**: `http://localhost:8080`
3. **Callback URL**: 
   ```
   http://localhost:8080/login/oauth2/code/naver
   ```

### 4. Client ID / Secret 확인
- 애플리케이션 등록 완료 후 표시됨
- **Client ID** 복사
- **Client Secret** 복사

---

## 3️⃣ 구글 로그인 설정

### 1. Google Cloud Console 접속
- URL: https://console.cloud.google.com/

### 2. 프로젝트 생성
1. 상단의 프로젝트 선택 → [새 프로젝트]
2. 프로젝트 이름: `handluck` (원하는 이름)

### 3. OAuth 동의 화면 설정
1. [API 및 서비스] → [OAuth 동의 화면]
2. **User Type**: 외부 선택
3. **앱 정보 입력**:
   - 앱 이름: `내 손 안에 손금`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처: 본인 이메일
4. **범위(Scope)**: email, profile 추가
5. **테스트 사용자**: 본인 이메일 추가

### 4. OAuth 2.0 클라이언트 ID 생성
1. [API 및 서비스] → [사용자 인증 정보]
2. [사용자 인증 정보 만들기] → [OAuth 클라이언트 ID]
3. **애플리케이션 유형**: 웹 애플리케이션
4. **승인된 리디렉션 URI**:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
5. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

---

## 4️⃣ application.properties 설정

발급받은 키를 아래 형식으로 입력하세요:

```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=실제_구글_클라이언트_ID
spring.security.oauth2.client.registration.google.client-secret=실제_구글_시크릿

# Kakao OAuth2
spring.security.oauth2.client.registration.kakao.client-id=실제_카카오_REST_API_키
spring.security.oauth2.client.registration.kakao.client-secret=실제_카카오_시크릿

# Naver OAuth2
spring.security.oauth2.client.registration.naver.client-id=실제_네이버_클라이언트_ID
spring.security.oauth2.client.registration.naver.client-secret=실제_네이버_시크릿
```

---

## ⚠️ 주의사항

1. **API 키는 절대 GitHub에 올리지 마세요!**
   - `.gitignore`에 `application.properties` 추가하거나
   - `application-secret.properties` 별도 파일 사용

2. **localhost 테스트 시**:
   - 반드시 `http://localhost:8080`으로 접속
   - `127.0.0.1`로 접속하면 Redirect URI 불일치 오류 발생

3. **카카오 이메일 동의**:
   - 이메일 수집은 비즈앱 전환이 필요할 수 있음
   - 개인 개발자는 닉네임만 수집 가능할 수 있음

---

## 🚀 테스트 방법

1. 서버 실행: `./gradlew bootRun` 또는 IDE에서 실행
2. 브라우저에서 `http://localhost:8080/login` 접속
3. 소셜 로그인 버튼 클릭
4. 각 플랫폼 로그인 화면에서 로그인
5. 동의 화면에서 동의
6. 메인 페이지로 리다이렉트되면 성공!
