package com.aloha.teamproject.api;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.TutorMyPage;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.service.FileService;
import com.aloha.teamproject.service.TutorFieldService;
import com.aloha.teamproject.service.TutorMyPageService;
import com.aloha.teamproject.service.TutorProfileService;
import com.aloha.teamproject.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


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

    @PostMapping("/profile")
    public ApiResponse<Void> profile(@RequestBody TutorProfile.Request request, Authentication authentication) {
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

    @PutMapping(
        value = "/profile",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<Void> profile(
            Authentication authentication,
            @ModelAttribute TutorProfile.Request request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try {
            TutorProfile profile = TutorProfile.builder()
                    .userId(authentication.getName())
                    .headline(request.getHeadline())
                    .bio(request.getBio())
                    .videoUrl(request.getVideoUrl())
                    .build();

            if (profileImage != null && !profileImage.isEmpty()) {
                String imagePath = fileService.saveProfileImage(profileImage);
                profile.setProfileImg(imagePath);
            }

            tutorProfileService.upsertProfile(profile);
            tutorFieldService.replaceFields(authentication.getName(), request.getFieldIds());

            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("튜터 프로필 저장 실패", e);
            return ApiResponse.error("튜터 프로필 저장 실패");
        }
    }
    
}
