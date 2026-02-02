package com.aloha.teamproject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class TutorsPageController {

    @GetMapping("/tutors")
    public String tutors(Model model) {
        List<Map<String, Object>> tutors = List.of(
            Map.of(
                "id", "u-tutor-1",
                "name", "김튜터",
                "rating", 4.9,
                "reviews", 127,
                "subjects", List.of("영어 회화", "문법"),
                "bio", "회화/문법 집중 코칭",
                "experience", "5년",
                "hourlyRate", 35000
            ),
            Map.of(
                "id", "u-tutor-2",
                "name", "이튜터",
                "rating", 4.7,
                "reviews", 89,
                "subjects", List.of("비즈니스 영어", "발음"),
                "bio", "실무 중심 회화",
                "experience", "4년",
                "hourlyRate", 40000
            )
        );

        model.addAttribute("tutors", tutors);
        return "tutors/list";
    }

    @GetMapping("/tutors/{id}")
    public String tutorDetail(@PathVariable("id") String id, Model model) {
        Map<String, Object> tutor = Map.of(
            "id", id,
            "name", "김튜터",
            "rating", 4.9,
            "reviews", 127,
            "subjects", List.of("영어 회화", "문법", "발음"),
            "bio", "중고급 회화/발음 집중",
            "experience", "5년",
            "hourlyRate", 35000,
            "availability", "평일 저녁, 주말"
        );

        Map<String, Object> review1 = new java.util.HashMap<>();
        review1.put("studentName", "학생A");
        review1.put("createdAt", java.time.LocalDateTime.of(2026, 1, 20, 0, 0));
        review1.put("rating", 5);
        review1.put("content", "설명이 정말 이해 잘 됐어요!");
        review1.put("reviewId", 1);
        review1.put("studentId", "s1");

        Map<String, Object> review2 = new java.util.HashMap<>();
        review2.put("studentName", "학생B");
        review2.put("createdAt", java.time.LocalDateTime.of(2026, 1, 12, 0, 0));
        review2.put("rating", 4);
        review2.put("content", "친절하고 꼼꼼해요.");
        review2.put("reviewId", 2);
        review2.put("studentId", "s2");

        Map<String, Object> review3 = new java.util.HashMap<>();
        review3.put("studentName", "학생C");
        review3.put("createdAt", java.time.LocalDateTime.of(2026, 1, 5, 0, 0));
        review3.put("rating", 5);
        review3.put("content", "발음 교정이 좋았습니다.");
        review3.put("reviewId", 3);
        review3.put("studentId", "s3");

        List<Map<String, Object>> reviews = List.of(review1, review2, review3);

        model.addAttribute("tutor", tutor);
        model.addAttribute("reviews", reviews);
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
