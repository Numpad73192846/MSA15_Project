package com.aloha.teamproject.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController{

	private final UserService userService;

	@GetMapping("/")
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
	public String mypage(Authentication authentication, Model model) {
		Users user = null;
		if (authentication != null && authentication.isAuthenticated()) {
			try {
				user = userService.selectById(authentication.getName());
			} catch (Exception e) {
				log.error("/mypage 사용자 조회 실패", e);
			}
		}

		if (user == null) {
			user = new Users();
			user.setName("게스트");
			user.setUsername("guest");
		}

		model.addAttribute("user", user);
		return "member/mypage";
	}

	@GetMapping({"/tutor/mypage", "/mypages"})
	public String tutorMyPage() {
		return "tutor/mypage";
	}

}
