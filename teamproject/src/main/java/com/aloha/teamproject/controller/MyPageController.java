package com.aloha.teamproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class MyPageController {

    @GetMapping("/tutor/mypage")
    public String tutorMyPage(Model model) {
        log.info("[GET] - /tutor/mypage");
        // In real implementation, would fetch tutor data from service
        // For now, returning view with mock data from template
        return "tutor/mypage";
    }

    @GetMapping("/member/mypage")
    public String memberMyPage(Model model) {
        log.info("[GET] - /member/mypage");
        // In real implementation, would fetch member data from service
        // For now, returning view with mock data from template
        return "member/mypage";
    }
}
