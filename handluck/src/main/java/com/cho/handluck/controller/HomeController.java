package com.cho.handluck.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 메인 페이지 컨트롤러
 * 홈페이지, 로그인, 기본 페이지 라우팅을 담당합니다.
 */
@Controller
public class HomeController {

    /**
     * 메인 페이지 (홈)
     * 
     * @return index.html 템플릿
     */
    @GetMapping("/")
    public String home() {
        return "index";
    }

    /**
     * 로그인 페이지
     * 
     * @return login.html 템플릿
     */
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    /**
     * 이메일 로그인 페이지
     * 
     * @return login-email.html 템플릿
     */
    @GetMapping("/login/email")
    public String loginEmail() {
        return "login-email";
    }

    /**
     * 손금 촬영/업로드 페이지
     * 
     * @return upload.html 템플릿
     */
    @GetMapping("/upload")
    public String upload() {
        return "upload";
    }

    /**
     * 마이페이지
     * 로그인한 사용자만 접근 가능 (Security 설정에서 처리)
     * 
     * @return mypage.html 템플릿
     */
    @GetMapping("/mypage")
    public String mypage() {
        return "mypage";
    }
}
