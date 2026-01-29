package com.aloha.teamproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MyPageController {

    private final UserService userService;

    @GetMapping("/tutor/mypage")
    public String tutorMyPage(Model model) {
        log.info("[GET] - /tutor/mypage");
        return "tutor/mypage";
    }

    @GetMapping("/member/mypage")
    public String memberMyPage(Model model) throws Exception {
        log.info("[GET] - /member/mypage");

        // 임시 데이터 (UI 테스트용)
        Users user = new Users();
        user.setName("홍길동");
        user.setUsername("hong@example.com");
        user.setNickname("길동이");

        model.addAttribute("user", user);
        return "member/mypage";
    }

    @PostMapping("/member/mypage/update")
    public String updateMember(Users user) throws Exception {
        log.info("[POST] - /member/mypage/update");
        log.info("user : " + user);

        // userService.update(user);

        return "redirect:/member/mypage";
    }

    @PostMapping("/tutor/mypage/update")
    public String updateTutor(Users user) {
        log.info("[POST] - /tutor/mypage/update");
        log.info("user (Tutor) : " + user);
        // Implement tutor update logic here
        return "redirect:/tutor/mypage";
    }
}
