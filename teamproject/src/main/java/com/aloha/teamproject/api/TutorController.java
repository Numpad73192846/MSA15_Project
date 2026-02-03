package com.aloha.teamproject.api;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.TutorMyPage;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.TutorFieldService;
import com.aloha.teamproject.service.TutorMyPageService;
import com.aloha.teamproject.service.TutorProfileService;
import com.aloha.teamproject.service.UserService;
import org.springframework.http.MediaType;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tutors")
public class TutorController {

    private final TutorProfileService tutorProfileService;
    private final TutorFieldService tutorFieldService;
    private final TutorMyPageService tutorMyPageService;
    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<TutorMyPage> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            
            TutorMyPage tutorMyPage = new TutorMyPage();
            tutorMyPage.setTutorProfile(tutorMyPageService.selectTutorProfileByUserId(userId));
            tutorMyPage.setLanguageFields(tutorMyPageService.selectTutorFieldsByUserId(userId));
            tutorMyPage.setTutorStats(tutorMyPageService.selectTutorStatsByUserId(userId));
            tutorMyPage.setUpcomingLessons(tutorMyPageService.selectUpcomingBookingsByUserId(userId));
            tutorMyPage.setTutorReviews(tutorMyPageService.selectTutorReviewsByUserId(userId));
            tutorMyPage.setMonthlyEarnings(tutorMyPageService.selectMonthlyEarningsByUserId(userId));

            return ApiResponse.ok(tutorMyPage);
        } catch (Exception e) {
            log.error("/api/tutors/me 조회 실패", e);
            return ApiResponse.error("튜터 정보를 조회하지 못했습니다.");
        }
    }

    @PostMapping("/subjects") 
    public ApiResponse<Void> subjects(@RequestBody String entity) {
        // TODO: 튜터 과목 관리 - 추후 구현 예정
        return ApiResponse.error("이 기능은 아직 구현 중입니다.");
    }

    @PostMapping("/careers")
    public ApiResponse<Void> careers(@RequestBody String entity) {
        // TODO: 튜터 경력 관리 - 추후 구현 예정
        return ApiResponse.error("이 기능은 아직 구현 중입니다.");
    }

    @PostMapping("/educations")
    public ApiResponse<Void> educations(@RequestBody String entity) {
        // TODO: 튜터 학력 관리 - 추후 구현 예정
        return ApiResponse.error("이 기능은 아직 구현 중입니다.");
    }

    @PostMapping("/time-ranges")
    public ApiResponse<Void> time_ranges(@RequestBody String entity) {
        // TODO: 시간대 관리는 /api/tutors/me/time-ranges에서 처리
        return ApiResponse.error("시간대 관리는 /api/tutors/me/time-ranges를 사용해주세요.");
    }

    @PostMapping("/documents")
    public ApiResponse<Void> documents(@RequestBody String entity) {
        // TODO: 튜터 문서 관리 - 추후 구현 예정
        return ApiResponse.error("이 기능은 아직 구현 중입니다.");
    }

    @PostMapping(
        value = "/profile",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<Void> profile(
        @ModelAttribute TutorProfile.Request request,
        Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {           

            String profileImgPath = null;
            if (request.getProfileImg() != null && !request.getProfileImg().isEmpty()) {
                profileImgPath = tutorProfileService.saveProfileImg(request.getProfileImg());
            }

            TutorProfile profile = TutorProfile.builder()
                                                .userId(authentication.getName())
                                                .profileImg(profileImgPath) // 파일 경로
                                                .headline(request.getHeadline())
                                                .bio(request.getBio())
                                                .selfIntro(request.getSelfIntro())
                                                .videoUrl(request.getVideoUrl())
                                                .build();

            tutorProfileService.upsertProfile(profile);
            tutorFieldService.replaceFields(authentication.getName(), request.getFieldIds());

            userService.deleteAuth(authentication.getName(), "ROLE_TUTOR_PENDING");
            userService.insertAuth(UserAuth.builder()
                                            .userId(authentication.getName())
                                            .auth("ROLE_TUTOR")
                                            .build());

            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("/api/tutors/profile 저장 실패", e);
            return ApiResponse.error("튜터 정보를 저장하지 못했습니다.");
        }
    }  
    
    // @PutMapping()
    // public ApiResponse<Void> updateTutorProfile(
    //         @AuthenticationPrincipal UserDetails userDetails,
    //         @ModelAttribute TutorProfile.Request request,
    //         @RequestParam(required = false) String name,
    //         @RequestParam(required = false) String phone,
    //         @RequestParam(required = false) String password,
    //         @RequestParam(required = false) String passwordConfirm
    // ) throws Exception {

    //     String userId = userDetails.getUsername();

    //     // 1️⃣ Users 정보 수정 (이름 / 전화 / 비밀번호)
    //     userService.updateMyInfo(userId, name, phone, password, passwordConfirm);

    //     // 2️⃣ TutorProfile 정보 수정
    //     TutorProfile profile = tutorProfileService.selectByUserId(userId);
    //     if (profile == null) {
    //         profile = new TutorProfile();
    //         profile.setUserId(userId);
    //     }

    //     profile.setHeadline(request.getHeadline());
    //     profile.setBio(request.getBio());
    //     profile.setSelfIntro(request.getSelfIntro());
    //     profile.setVideoUrl(request.getVideoUrl());

    //     // 프로필 이미지
    //     if (request.getProfileImg() != null && !request.getProfileImg().isEmpty()) {
    //         String imgPath = tutorProfileService.saveProfileImg(request.getProfileImg());
    //         profile.setProfileImg(imgPath);
    //     }

    //     tutorProfileService.upsertProfile(profile);

    //     return ApiResponse.ok();
    // }

    
}
