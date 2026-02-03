package com.aloha.teamproject.api;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.TutorMyPage;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.dto.TutorCareer;
import com.aloha.teamproject.dto.TutorEducation;
import com.aloha.teamproject.dto.TutorSubject;
import com.aloha.teamproject.service.TutorCareerService;
import com.aloha.teamproject.service.TutorDocumentService;
import com.aloha.teamproject.service.TutorEducationService;
import com.aloha.teamproject.service.TutorFieldService;
import com.aloha.teamproject.service.TutorMyPageService;
import com.aloha.teamproject.service.TutorProfileService;
import com.aloha.teamproject.service.TutorSubjectService;
import com.aloha.teamproject.service.UserService;
import com.aloha.teamproject.dto.TutorDocument;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tutors")
public class TutorController {

    private final TutorProfileService tutorProfileService;
    private final TutorFieldService tutorFieldService;
    private final TutorMyPageService tutorMyPageService;
    private final UserService userService;
    private final TutorSubjectService tutorSubjectService;
    private final TutorCareerService tutorCareerService;
    private final TutorEducationService tutorEducationService;
    private final TutorDocumentService tutorDocumentService;

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
    public ApiResponse<Void> subjects(@RequestBody TutorSubject.Request request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            tutorSubjectService.replaceSubjects(userId, request.getSubjectIds());
            return ApiResponse.ok(SuccessCode.UPDATED);
        } catch (Exception e) {
            log.error("/api/tutors/subjects 저장 실패", e);
            return ApiResponse.error("과목 정보를 저장하지 못했습니다.");
        }
    }

    @PostMapping("/careers")
    public ApiResponse<Void> careers(@RequestBody TutorCareer.Request request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            tutorCareerService.replaceCareers(userId, request.getCareers());
            return ApiResponse.ok(SuccessCode.UPDATED);
        } catch (Exception e) {
            log.error("/api/tutors/careers 저장 실패", e);
            return ApiResponse.error("경력 정보를 저장하지 못했습니다.");
        }
    }

    @PostMapping("/educations")
    public ApiResponse<Void> educations(@RequestBody TutorEducation.Request request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            tutorEducationService.replaceEducations(userId, request.getEducations());
            return ApiResponse.ok(SuccessCode.UPDATED);
        } catch (Exception e) {
            log.error("/api/tutors/educations 저장 실패", e);
            return ApiResponse.error("학력 정보를 저장하지 못했습니다.");
        }
    }

    @PostMapping("/documents")
    public ApiResponse<Void> documents(@RequestBody TutorDocument document, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            document.setUserId(authentication.getName());
            tutorDocumentService.insert(document);
            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("/api/tutors/documents 저장 실패", e);
            return ApiResponse.error("문서를 저장하지 못했습니다.");
        }
    }

    @GetMapping("/documents")
    public ApiResponse<java.util.List<TutorDocument>> getDocuments(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            java.util.List<TutorDocument> documents = tutorDocumentService.selectByUserId(authentication.getName());
            return ApiResponse.ok(documents);
        } catch (Exception e) {
            log.error("/api/tutors/documents 조회 실패", e);
            return ApiResponse.error("문서를 조회하지 못했습니다.");
        }
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
