package com.aloha.teamproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/auth")
public class AuthController {

    /**
     * 로그인 화면
     * @return
     */
    @GetMapping("/login")
    public String login() {
        log.info("로그인 화면 요청");
        return "auth/login";
    }

    /**
     * 학생 회원가입 화면
     * @return
     */
    @GetMapping("/join_form")
    public String joinForm() {
        log.info("회원가입 화면 요청");
        return "auth/join_form";
    }

    /**
     * 튜터 회원가입 화면
     * @return
     */
    @GetMapping("/join_form_tutor")
    public String joinFormTutor() {
        log.info("튜터 회원가입 화면 요청");
        return "auth/join_form_tutor";
    }
}
