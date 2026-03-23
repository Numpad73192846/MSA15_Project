# 프로젝트 : 튜터링고 (Tutoring-Go)

<p align="center">
  <img src="./teamproject-app/src/assets/image/logo.png" width="200" alt="튜터링고 로고">
</p>

> 튜터와 튜티를 연결하고, 예약과 결제까지 관리할 수 있는 매칭 플랫폼

<br>

## 시연 영상

> 이미지를 클릭하면 시연 영상으로 이동합니다.
[![시연 영상](./teamproject-app/src/assets/image/logo.png)](https://www.youtube.com/watch?v=ttQkyqMMFas)

<br>

---

## 목차
- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 시스템 구조](#2-시스템-구조)
- [3. 팀 구성 및 역할](#3-팀-구성-및-역할)
- [4. 기술 스택](#4-기술-스택)
- [5. 주요 기능](#5-주요-기능)
- [6. 프로젝트 산출물](#6-프로젝트-산출물)
- [7. 화면 UI](#7-화면-ui)
- [8. 회고](#8-회고)

---

<br>

## 1. 프로젝트 개요

### 1-1. 프로젝트 주제
- 튜터/튜티 매칭 기반 수업 예약 및 결제 플랫폼

### 1-2. 주제 선정 배경
- 개인 과외 및 튜터링 서비스의 수요 증가
- 튜터 탐색, 예약, 결제 과정이 분산되어 있는 문제

### 1-3. 기획 의도
- 튜터 탐색부터 예약, 결제까지 하나의 플랫폼에서 처리
- 사용자 중심의 수업 관리 및 매칭 서비스 제공

### 1-4. 활용 방안
- 사용자는 원하는 튜터를 탐색하고 수업을 예약할 수 있음
- 튜터는 자신의 수업을 등록하고 예약을 관리할 수 있음

### 1-5. 기대효과
- 사용자 편의성 향상
- 튜터와 튜티 간 매칭 효율 증가

<br>

---

## 2. 시스템 구조

### 2-1. 시스템 아키텍처

### 2-2. 주요 기능

| 구분 | 기능 |
|------|------|
| 인증 | 회원가입, 로그인/로그아웃, JWT 인증, Refresh Token |
| 회원 | 프로필 관리, 마이페이지 |
| 튜터 | 튜터 등록, 프로필 관리, 검색/조회, 스케줄 관리 |
| 예약 | 수업 예약, 예약 승인/거절, 취소, 시간 충돌 방지 |
| 결제 | 결제 처리, 결제 상태 관리, 결제 내역 조회 |
| 리뷰 | 리뷰 작성/조회/수정/삭제, 평점 관리 |
| 메시지 | 튜터-학생 간 메시지 기능 |
| 관리자 | 튜터 승인, 회원 관리, 과목 관리 |
| AI | OpenAI 기반 보조 기능 |

---

<br>

## 3. 팀 구성 및 역할

| 이름 | 역할 | 담당 업무 |
|:---:|:---:|:---|
| 팀원1 | 팀장 | 프로젝트 총괄 / 기능 통합 |
| 정성준 | 팀원 | 인증 및 데이터 처리 / 기능 구현 |
| 팀원2 | 팀원 | UI 구성 및 프론트 |
| 팀원3 | 팀원 | 기능 구현 및 테스트 |

> 인원 : **4명** | 기간 : **약 3주**

---

<br>

## 4. 기술 스택

### Frontend
<div align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-264DE4?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/Thymeleaf-005F0F?style=for-the-badge">
</div>

### Backend
<div align="left">
  <img src="https://img.shields.io/badge/Java-000000?style=for-the-badge&logo=openjdk&logoColor=white">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white">
  <img src="https://img.shields.io/badge/MyBatis-000000?style=for-the-badge">
</div>

### Database
<div align="left">
  <img src="https://img.shields.io/badge/MySQL-262626?style=for-the-badge&logo=oracle&logoColor=white">
</div>

### API / Service
<div align="left">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge">
  <img src="https://img.shields.io/badge/OAuth2-4285F4?style=for-the-badge&logo=google&logoColor=white">
  <img src="https://img.shields.io/badge/Toss_Payments-1E64FF?style=for-the-badge">
  <img src="https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge">
</div>

### Tools
<div align="left">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github">
</div>

---

## 5. 프로젝트 수행 경과

### ERD
<details>
  <summary>ERD 보기</summary>
  <p align="center">
    <img src="./docs/images/erd.png" width="900">
  </p>

  > 전체 ERD는 인터랙티브 화면으로 확인할 수 있습니다.  
  > [ERD 상세 보기 (Interactive)](https://numpad73192846.github.io/MSA15_Project/docs/erd/MSA15기_1조_튜터링고ERD.html)
</details>

### 요구사항 정의서
<details>
  <summary>요구사항 정의서 보기</summary>

  <p align="center">
    <img src="./docs/images/2026-03-23 15 48 24.png" width="900">
  </p>
</details>

### 기능 정의서
<details>
  <summary>기능 정의서 보기</summary>
  
  <p align="center">
    <img src="./docs/images/2026-03-23 15 41 36.png" width="900">
  </p>
</details>

---

## 7. 화면 UI

### 메인 화면
<details>
  <summary>보기</summary>

  <img src="여기에_이미지">
</details>

---

## 8. 회고

### 잘한 점
- 인증과 예약, 결제 기능을 통합하여 서비스 흐름 구현
- 외부 API를 활용한 기능 확장

### 아쉬운 점
- 초기 설계 부족으로 일부 기능 수정 발생

### 개선할 점
- 설계 단계의 완성도 향상
- 협업 프로세스 개선
