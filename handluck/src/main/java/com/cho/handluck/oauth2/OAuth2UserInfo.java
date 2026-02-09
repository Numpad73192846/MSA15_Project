package com.cho.handluck.oauth2;

import com.cho.handluck.domain.AuthProvider;
import com.cho.handluck.domain.Role;
import com.cho.handluck.domain.User;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

/**
 * OAuth2 사용자 속성 정보
 * 각 소셜 로그인 제공자별 응답 형식을 통일된 형식으로 변환합니다.
 */
@Getter
@Builder
public class OAuth2UserInfo {

    private String providerId;
    private String email;
    private String nickname;
    private String profileImage;
    private AuthProvider provider;

    /**
     * OAuth2 제공자별 사용자 정보 추출
     */
    public static OAuth2UserInfo of(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId.toLowerCase()) {
            case "kakao" -> ofKakao(attributes);
            case "naver" -> ofNaver(attributes);
            case "google" -> ofGoogle(attributes);
            default -> throw new IllegalArgumentException("지원하지 않는 소셜 로그인입니다: " + registrationId);
        };
    }

    /**
     * 카카오 로그인 사용자 정보 추출
     * 카카오는 이메일 동의가 선택사항이므로 null 처리 필요
     */
    @SuppressWarnings("unchecked")
    private static OAuth2UserInfo ofKakao(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = kakaoAccount != null
                ? (Map<String, Object>) kakaoAccount.get("profile")
                : null;

        String providerId = String.valueOf(attributes.get("id"));
        String email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
        String nickname = profile != null ? (String) profile.get("nickname") : "카카오 사용자";
        String profileImage = profile != null ? (String) profile.get("profile_image_url") : null;

        // 이메일이 없으면 카카오 ID 기반으로 임시 이메일 생성
        if (email == null || email.isBlank()) {
            email = "kakao_" + providerId + "@handluck.local";
        }

        return OAuth2UserInfo.builder()
                .providerId(providerId)
                .email(email)
                .nickname(nickname)
                .profileImage(profileImage)
                .provider(AuthProvider.KAKAO)
                .build();
    }

    /**
     * 네이버 로그인 사용자 정보 추출
     * 네이버는 response 객체 안에 사용자 정보가 있음
     */
    @SuppressWarnings("unchecked")
    private static OAuth2UserInfo ofNaver(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        if (response == null) {
            throw new IllegalArgumentException("네이버 로그인 응답에서 사용자 정보를 찾을 수 없습니다.");
        }

        String providerId = (String) response.get("id");
        String email = (String) response.get("email");
        String nickname = (String) response.get("name");
        String profileImage = (String) response.get("profile_image");

        // 이메일이 없으면 네이버 ID 기반으로 임시 이메일 생성
        if (email == null || email.isBlank()) {
            email = "naver_" + providerId + "@handluck.local";
        }

        // 닉네임이 없으면 기본값 설정
        if (nickname == null || nickname.isBlank()) {
            nickname = "네이버 사용자";
        }

        return OAuth2UserInfo.builder()
                .providerId(providerId)
                .email(email)
                .nickname(nickname)
                .profileImage(profileImage)
                .provider(AuthProvider.NAVER)
                .build();
    }

    /**
     * 구글 로그인 사용자 정보 추출
     */
    private static OAuth2UserInfo ofGoogle(Map<String, Object> attributes) {
        return OAuth2UserInfo.builder()
                .providerId((String) attributes.get("sub"))
                .email((String) attributes.get("email"))
                .nickname((String) attributes.get("name"))
                .profileImage((String) attributes.get("picture"))
                .provider(AuthProvider.GOOGLE)
                .build();
    }

    /**
     * User 엔티티 생성
     */
    public User toEntity() {
        return User.builder()
                .email(email)
                .nickname(nickname)
                .profileImage(profileImage)
                .provider(provider)
                .providerId(providerId)
                .role(Role.USER)
                .build();
    }
}
