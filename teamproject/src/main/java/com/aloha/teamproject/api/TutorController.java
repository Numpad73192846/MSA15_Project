package com.aloha.teamproject.api;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.dto.TutorProfileRequest;
import com.aloha.teamproject.service.TutorFieldService;
import com.aloha.teamproject.service.TutorProfileService;
import com.aloha.teamproject.service.UserService;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tutors")
public class TutorController {

    private final TutorProfileService tutorProfileService;
    private final TutorFieldService tutorFieldService;
    private final UserService userService;

    @PostMapping("/subjects")
    public String subjects(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    @PostMapping("/careers")
    public String careers(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    @PostMapping("/educations")
    public String educations(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    @PostMapping("/time-ranges")
    public String time_ranges(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    @PostMapping("/documents")
    public String documents(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    @PostMapping("/profile")
    public ApiResponse<Void> profile(@RequestBody TutorProfileRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            TutorProfile profile = TutorProfile.builder()
                                                .userId(authentication.getName())
                                                .profileImg(request.getProfileImg())
                                                .headline(request.getHeadline())
                                                .bio(request.getBio())
                                                .videoUrl(request.getVideoUrl())
                                                .build();

            tutorProfileService.upsertProfile(profile);
            tutorFieldService.replaceFields(authentication.getName(), request.getFieldIds());

            userService.deleteAuth(authentication.getName(), "ROLE_TUTOR_PENDING");
            userService.insertAuth(com.aloha.teamproject.dto.UserAuth.builder()
                                                                   .userId(authentication.getName())
                                                                   .auth("ROLE_TUTOR")
                                                                   .build());
            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("/api/tutors/profile 저장 실패", e);
            return ApiResponse.error("튜터 정보를 저장하지 못했습니다.");
        }
    }
    
}
