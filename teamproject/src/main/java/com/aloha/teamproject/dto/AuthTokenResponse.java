package com.aloha.teamproject.dto;

import java.util.List;

import lombok.Data;

@Data
public class AuthTokenResponse {
    
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private String userId;
    private List<String> authList;

}
