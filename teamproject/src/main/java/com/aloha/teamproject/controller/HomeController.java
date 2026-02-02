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
}
