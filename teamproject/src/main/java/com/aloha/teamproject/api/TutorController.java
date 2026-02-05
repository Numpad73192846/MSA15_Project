package com.aloha.teamproject.api;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FilenameUtils;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.TutorList;
import com.aloha.teamproject.dto.TutorDocument;
import com.aloha.teamproject.dto.TutorMyPage;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.service.TutorDocumentService;
import com.aloha.teamproject.service.TutorFieldService;
import com.aloha.teamproject.service.TutorListService;
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
    private final TutorDocumentService tutorDocumentService;
    private final TutorFieldService tutorFieldService;
    private final TutorMyPageService tutorMyPageService;
    private final UserService userService;
    private final TutorListService tutorListService;

    private static final String DOC_UPLOAD_DIR = "uploads/tutors/documents/";

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
            tutorMyPage.setPastLessons(tutorMyPageService.selectPastBookingsByUserId(userId));
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

    @GetMapping("/documents")
    public ApiResponse<List<TutorDocument>> myDocuments(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            List<TutorDocument> docs = tutorDocumentService.selectByUserId(authentication.getName());
            return ApiResponse.ok(docs);
        } catch (Exception e) {
            log.error("/api/tutors/documents 조회 실패", e);
            return ApiResponse.error("서류 목록을 가져오지 못했습니다.");
        }
    }

    @PostMapping(
        value = "/documents",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<Void> uploadDocument(
        Authentication authentication,
        @RequestParam("docType") String docType,
        @RequestParam("file") MultipartFile file
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }
        if (file == null || file.isEmpty()) {
            return ApiResponse.error("업로드할 파일이 없습니다.");
        }

        Set<String> allowed = Set.of("EDUCATION", "DEGREE", "CERTIFICATE");
        if (!allowed.contains(docType)) {
            return ApiResponse.error("허용되지 않는 서류 유형입니다.");
        }

        try {
            String originalName = file.getOriginalFilename();
            String ext = FilenameUtils.getExtension(originalName);
            String storeName = UUID.randomUUID() + (ext != null && !ext.isBlank() ? "." + ext : "");
            Path path = Paths.get(DOC_UPLOAD_DIR + storeName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            TutorDocument doc = TutorDocument.builder()
                .userId(authentication.getName())
                .docType(docType)
                .fileSize((int) file.getSize())
                .originalName(originalName)
                .storeName(storeName)
                .filePath("/uploads/tutors/documents/" + storeName)
                .contentType(file.getContentType())
                .build();

            tutorDocumentService.insert(doc);
            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("/api/tutors/documents 업로드 실패", e);
            return ApiResponse.error("서류 업로드에 실패했습니다.");
        }
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
    
    @PutMapping(
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<Void> updateTutorProfile(
            Authentication authentication,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "passwordConfirm", required = false) String passwordConfirm,
            @RequestParam(value = "headline", required = false) String headline,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "selfIntro", required = false) String selfIntro,
            @RequestParam(value = "videoUrl", required = false) String videoUrl,
            @RequestParam(value = "bankName", required = false) String bankName,
            @RequestParam(value = "accountNumber", required = false) String accountNumber,
            @RequestParam(value = "accountHolder", required = false) String accountHolder,
            @RequestParam(value = "profileImg", required = false) MultipartFile profileImg
    ) throws Exception {

        
        if (authentication == null || !authentication.isAuthenticated()) {
            log.error("인증 실패");
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();

            // 1️⃣ Users 정보 수정 (이름 / 전화 / 비밀번호)
            userService.updateMyInfo(userId, name, phone, password, passwordConfirm);

            // 2️⃣ TutorProfile 정보 수정
            TutorProfile profile = tutorProfileService.selectByUserId(userId);
            if (profile == null) {
                profile = new TutorProfile();
                profile.setUserId(userId);
            }

            profile.setHeadline(headline);
            profile.setBio(bio);
            profile.setSelfIntro(selfIntro);
            profile.setVideoUrl(videoUrl);
            profile.setBankName(bankName);
            profile.setAccountNumber(accountNumber);
            profile.setAccountHolder(accountHolder);

            // 프로필 이미지
            if (profileImg != null && !profileImg.isEmpty()) {
                String imgPath = tutorProfileService.saveProfileImg(profileImg);
                profile.setProfileImg(imgPath);
                log.info("프로필 이미지 저장 완료: {}", imgPath);
            }

            tutorProfileService.upsertProfile(profile);
            log.info("TutorProfile 업데이트 완료");

            return ApiResponse.ok(SuccessCode.UPDATED);
        } catch (Exception e) {
            log.error("프로필 수정 실패", e);
            return ApiResponse.error("프로필 수정 실패: " + e.getMessage());
        }
    }

    @GetMapping()
    public ApiResponse<List<TutorList>> searchTutors(
        @RequestParam(value = "searchTerm", required = false) String searchTerm,
        @RequestParam(value = "language", required = false) String language,
        @RequestParam(value = "subjects", required = false) String subjects,
        @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
        @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice
    ) {

        try {
            List<TutorList> tutors;

            if ( StringUtils.hasText(searchTerm) ) {
                tutors = tutorListService.selectTutorsBySearchTerm(searchTerm);
            } else {
                tutors = tutorListService.selectAllTutors();
            }

            if ( StringUtils.hasText(language) && !"all".equals(language) ) {
                final String lang = language.trim();
                tutors = tutors.stream()
                               .filter(tutor -> tutor.getSubjects() != null && tutor.getSubjects().contains(lang))
                               .collect(Collectors.toList());
            } 

            if ( StringUtils.hasText(subjects) ) {
                List<String> subjectList = Arrays.stream(subjects.split(","))
                                               .map(String::trim)
                                               .filter(s -> !s.isEmpty())
                                               .collect(Collectors.toList());
                if (!subjectList.isEmpty()) {
                    tutors = tutors.stream()
                                   .filter(tutor -> {
                                        if (tutor.getSubjects() == null) {
                                            return false;
                                        }
                                        return subjectList.stream()
                                                          .anyMatch(subject -> tutor.getSubjects().contains(subject));
                                    })
                                   .collect(Collectors.toList());
                }
            }

            if ( minPrice != null || maxPrice != null ) {
                final BigDecimal min = (minPrice != null) ? minPrice : BigDecimal.ZERO;
                final BigDecimal max = (maxPrice != null) ? maxPrice : BigDecimal.valueOf(Double.MAX_VALUE);

                tutors = tutors.stream()
                               .filter(tutor -> {
                                    if ( tutor.getPrice() == null ) {
                                        return false;
                                    }
                                    return tutor.getPrice().compareTo(min) >= 0 && tutor.getPrice().compareTo(max) <= 0;
                               })
                               .collect(Collectors.toList());
            }
            return ApiResponse.ok(tutors);

        } catch (Exception e) {
            return ApiResponse.error("튜터 목록을 조회할 수 없습니다.");
        }
    }
    
    
}
