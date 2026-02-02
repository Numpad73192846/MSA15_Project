package com.aloha.teamproject.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorList {
    
    private String id;
    private String userId;
    private String name;
    private String bio;
    private BigDecimal ratingAvg;
    private Integer reviewCount;
    private String profileImg;
    private String subjects;
    private BigDecimal price;
    private String experience;

}
