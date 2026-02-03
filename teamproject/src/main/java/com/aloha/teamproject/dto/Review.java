package com.aloha.teamproject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    
    private String id;
    private String bookingId;
    private Integer rating;
    private String content;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String bookingId;
        private Integer rating;
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String bookingId;
        private Integer rating;
        private String content;
        private String tutorName;
        private String studentName;
        private String lessonTitle;
    }
}
