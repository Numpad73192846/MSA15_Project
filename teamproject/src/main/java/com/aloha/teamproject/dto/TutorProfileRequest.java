package com.aloha.teamproject.dto;

import lombok.Data;
import java.util.List;

@Data
public class TutorProfileRequest {
    private String profileImg;
    private String headline;
    private String bio;
    private String videoUrl;
    private List<String> fieldIds;
}
