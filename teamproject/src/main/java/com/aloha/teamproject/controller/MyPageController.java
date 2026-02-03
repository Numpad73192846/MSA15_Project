package com.aloha.teamproject.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.TutorProfileService;
import com.aloha.teamproject.service.UserService;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MyPageController {

    private final UserService userService;
    private final TutorProfileService tutorProfileService;

    @GetMapping("/tutor/mypage")
    public String tutorMyPage(Model model) {
        log.info("[GET] - /tutor/mypage");
        return "tutor/mypage";
    }

    @GetMapping("/member/mypage")
    public String memberMyPage(Model model, Authentication authentication) throws Exception {
        log.info("[GET] - /member/mypage");

        Users user = null;
        if (authentication != null && authentication.isAuthenticated()) {
            try {
                user = userService.selectById(authentication.getName());
            } catch (Exception e) {
                log.error("사용자 정보 조회 실패", e);
            }
        }
        
        if (user == null) {
            user = new Users();
            user.setName("게스트");
            user.setUsername("guest@example.com");
        }

        model.addAttribute("user", user);
        return "member/mypage";
    }

    @PostMapping("/member/mypage/update")
    public String updateMember(Users user, 
                               @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
                               Authentication authentication) throws Exception {
        log.info("[POST] - /member/mypage/update");
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }
        
        try {
            Users existingUser = userService.selectById(authentication.getName());
            if (existingUser != null) {
                existingUser.setName(user.getName());
                existingUser.setNickname(user.getNickname());
                userService.update(existingUser);
            }
        } catch (Exception e) {
            log.error("회원 정보 업데이트 실패", e);
        }

        return "redirect:/member/mypage";
    }

    @PostMapping("/tutor/mypage/update")
    public String updateTutor(@RequestParam(value = "name", required = false) String name,
                              @RequestParam(value = "bio", required = false) String bio,
                              Authentication authentication) {
        log.info("[POST] - /tutor/mypage/update");
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }
        
        try {
            String userId = authentication.getName();
            
            // 사용자 이름 업데이트
            Users existingUser = userService.selectById(userId);
            if (existingUser != null && name != null) {
                existingUser.setName(name);
                userService.update(existingUser);
            }
            
            // 튜터 프로필 업데이트
            if (bio != null) {
                TutorProfile profile = TutorProfile.builder()
                    .userId(userId)
                    .bio(bio)
                    .build();
                tutorProfileService.upsertProfile(profile);
            }
        } catch (Exception e) {
            log.error("튜터 정보 업데이트 실패", e);
        }
        
        return "redirect:/tutor/mypage";
    }
}
