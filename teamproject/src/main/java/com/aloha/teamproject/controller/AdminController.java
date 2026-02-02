package com.aloha.teamproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.aloha.teamproject.service.AdminService;

@Slf4j
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public String adminIndex(Model model) {
        log.info("Entering adminIndex");
        model.addAttribute("pendingDocs", adminService.getPendingDocuments());
        model.addAttribute("settlements", adminService.getTutorSettlements());
        return "admin/admin";
    }
}
