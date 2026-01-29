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

    @GetMapping("/mypage")
	public String mypage() {
		return "member/mypage";
	}

    @GetMapping("/mypages")
	public String mypages() {
		return "tutor/mypage";
	}

}
