package com.aloha.teamproject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.aloha.teamproject.dto.TutorList;
import com.aloha.teamproject.dto.TutorReview;
import com.aloha.teamproject.service.TutorListService;
import com.aloha.teamproject.service.TutorMyPageService;

@Controller
public class TutorsPageController {
    
    @Autowired
    private TutorListService tutorListService;
    
    @Autowired
    private TutorMyPageService tutorMyPageService;

    @GetMapping("/tutors")
    public String tutors(Model model) {
        return "tutors/list";
    }

    @GetMapping("/tutors/{id}")
    public String tutorDetail(@PathVariable("id") String id, Model model) {
        try {
            // 튜터 정보 조회
            TutorList tutor = tutorListService.selectTutorById(id);
            
            // 리뷰 목록 조회
            List<TutorReview> reviews = tutorMyPageService.selectTutorReviewsByUserId(id);
            
            if (tutor != null) {
                model.addAttribute("tutor", tutor);
                model.addAttribute("reviews", reviews);
                model.addAttribute("reviewCount", reviews != null ? reviews.size() : 0);
                if (reviews != null && !reviews.isEmpty()) {
                    double avgRating = reviews.stream()
                        .mapToInt(TutorReview::getRating)
                        .average()
                        .orElse(0.0);
                    model.addAttribute("avgRating", avgRating);
                } else {
                    model.addAttribute("avgRating", 0.0);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "tutors/detail";
    }

    @GetMapping("/tutor/dashboard")
    public String tutorDashboard(Model model) {
        List<Map<String, Object>> bookings = List.of(
            Map.of(
                "id", "b-1",
                "studentName", "김학생",
                "subject", "영어 회화",
                "status", "대기중",
                "date", "2026-01-30",
                "time", "14:00",
                "duration", 2,
                "totalPrice", 70000
            ),
            Map.of(
                "id", "b-2",
                "studentName", "박학생",
                "subject", "문법",
                "status", "확정",
                "date", "2026-02-01",
                "time", "19:00",
                "duration", 1,
                "totalPrice", 35000
            )
        );

        List<Map<String, Object>> students = List.of(
            Map.of(
                "name", "김학생",
                "email", "student1@email.com",
                "phone", "010-1234-5678",
                "subjects", List.of("영어 회화", "발음"),
                "totalSessions", 12,
                "lastSession", "2026-01-20",
                "progress", "기초 회화 완료",
                "notes", "발음 집중 요청"
            ),
            Map.of(
                "name", "박학생",
                "email", "student2@email.com",
                "phone", "010-2222-3333",
                "subjects", List.of("문법"),
                "totalSessions", 6,
                "lastSession", "2026-01-18",
                "progress", "문법 2단원 진행 중",
                "notes", "시험 대비"
            )
        );

        model.addAttribute("bookings", bookings);
        model.addAttribute("students", students);
        return "tutor/dashboard";
    }

    // ============================== 수정 시작 (튜터 회원가입 페이지 매핑 추가) ==============================
    // 작성일: 2026-01-30 12:03분 수정했어요~! (조성진)
    // 수정 내용: 튜터 회원가입을 4단계로 나누어 진행하기 위한 페이지 매핑 추가
    
    @GetMapping("/tutor/register")
    public String tutorRegister() {
        return "tutor/register";
    }

    @GetMapping("/tutor/register1")
    public String tutorRegister1() {
        return "tutor/register1";
    }

    @GetMapping("/tutor/register2")
    public String tutorRegister2() {
        return "tutor/register2";
    }

    @GetMapping("/tutor/register3")
    public String tutorRegister3() {
        return "tutor/register3";
    }
    
    // ============================== 수정 종료 (튜터 회원가입 페이지 매핑 추가) ==============================
}
