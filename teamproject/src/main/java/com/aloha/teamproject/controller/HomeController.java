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

	@GetMapping("/tutor/register")
	public String tutorRegister() {
		return "tutor/register";
	}

    @GetMapping("/mypage")
	public String mypage() {
		return "member/mypage";
	}

	@GetMapping("/mypages")
	public String tutorMyPage() {
		return "tutor/mypage";
	}

}
