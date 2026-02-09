package com.cho.handluck.domain;

/**
 * 인증 제공자 열거형
 * 소셜 로그인 제공자 및 이메일 로그인을 구분합니다.
 */
public enum AuthProvider {
    KAKAO,
    NAVER,
    GOOGLE,
    EMAIL
}
