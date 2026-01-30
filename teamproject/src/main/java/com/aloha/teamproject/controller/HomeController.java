package com.aloha.teamproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class HomeController{

	@GetMapping("")
	public String home() {
		return "index";
	}

	@GetMapping("/login")
	public String login() {
		return "auth/login";
	}

	@GetMapping("/join")
	public String join() {
		return "redirect:/login#tabSignup";
	}

	// ============================== 수정 (튜터 회원가입 매핑 이동) ==============================
	// 작성일: 2026-01-30
	// 수정 내용: /tutor/register 매핑을 TutorsPageController로 이동 (중복 제거)
	// 기존 코드 주석 처리:
	// @GetMapping("/tutor/register")
	// public String tutorRegister() {
	//     return "tutor/register";
	// }
	// ============================== 수정 종료 ==============================

    @GetMapping("/mypage")
	public String mypage() {
		return "member/mypage";
	}

	@GetMapping("/mypages")
	public String tutorMyPage() {
		return "tutor/mypage";
	}

}
