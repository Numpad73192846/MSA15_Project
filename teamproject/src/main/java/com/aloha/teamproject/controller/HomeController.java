package com.aloha.teamproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

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

    @GetMapping("/tutor/schedule-edit")
    public String tutorScheduleEdit() {
        return "tutor/schedule-edit";
    }

	@GetMapping("/guide")
	public String guide() {
		return "guide/tutor-guide";
	}

	@GetMapping("/guide/policies")
	public String policies() {
		return "guide/policies";
	}

	@GetMapping("/faq")
	public String faq() {
		return "guide/faq";
	}

	@GetMapping("/contact")
	public String contact() {
		return "guide/contact";
	}

	@GetMapping("/about")
	public String about() {
		return "guide/aboutus";
	}

	@GetMapping("/partnership")
	public String partnership() {
		return "guide/partner";
	}

}
