package com.aloha.teamproject.dto;

import java.util.List;

import lombok.Data;

public class AuthDto {

    @Data
    public static class TokenResponse {
        private String accessToken;
        private String refreshToken;
        private Long expiresIn;
        private String userId;
        private List<String> authList;
    }

    @Data
    public static class RefreshTokenRequest {
        private String refreshToken;
    }
}
