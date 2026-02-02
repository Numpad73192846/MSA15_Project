package com.aloha.teamproject.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TutorProfile {

    private Long no;
    private String userId;
    private String name;
    private String email;
    private String nickname;
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    private String profileImg;
    private String headline;
    private String bio;
    private String videoUrl;
    @Builder.Default
    private boolean verified = false;
    @Builder.Default
    private BigDecimal ratingAvg = BigDecimal.ZERO;
    @Builder.Default
    private int reviewCount = 0;
    private Date createdAt;
    private Date updatedAt;

    public TutorProfile() {
        this.id = UUID.randomUUID().toString();
        this.verified = false;
        this.ratingAvg = BigDecimal.ZERO;
        this.reviewCount = 0;
    }

    @Data
    public static class Request {
        private String profileImg;
        private String headline;
        private String bio;
        private String videoUrl;
        private List<String> fieldIds;
    }
}
