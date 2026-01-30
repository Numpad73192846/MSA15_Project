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

        List<Map<String, Object>> reviews = List.of(
            Map.of("name", "학생A", "date", "2026-01-20", "rating", 5, "comment", "설명이 정말 이해 잘 됐어요!"),
            Map.of("name", "학생B", "date", "2026-01-12", "rating", 4, "comment", "친절하고 꼼꼼해요."),
            Map.of("name", "학생C", "date", "2026-01-05", "rating", 5, "comment", "발음 교정이 좋았습니다.")
        );

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
}
