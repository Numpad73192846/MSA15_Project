package com.aloha.teamproject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.aloha.teamproject.dto.TutorList;
import com.aloha.teamproject.service.TutorListService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class TutorsPageController {

    private final TutorListService tutorListService;

    @GetMapping("/tutors")
    public String tutors(Authentication authentication, Model model) {
        try {
            List<TutorList> tutors = tutorListService.selectAllTutors();
            
            // DB에서 이미 rating_avg와 review_count를 가져왔으므로 별도 처리 불필요
            model.addAttribute("tutors", tutors);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "tutors/list";
    }

    @GetMapping("/tutors/{id}")
    public String tutorDetail(@PathVariable("id") String id, Model model) {

        try {
            // 직접 단일 튜터 조회 (효율적)
            TutorList tutor = tutorListService.selectTutorById(id);

            if ( tutor == null ) {
                return "redirect:/tutors";
            }

            Map<String, Object> tutorMap = Map.of(
            "id", tutor.getUserId(),
            "name", tutor.getName(),
            "ratingAvg", tutor.getRatingAvg(),
            "reviewCount", tutor.getReviewCount(),
            "subjects", tutor.getSubjects() != null ? tutor.getSubjects().split(",") : new String[]{},
            "bio", tutor.getBio(),
            "experience", tutor.getExperience(),
            "hourlyRate", tutor.getPrice(),
            "availability", "평일 저녁, 주말"
            );
            
            // TODO: Review 기능이 재구현되면 여기에 리뷰 데이터 추가
            model.addAttribute("tutor", tutorMap);
            model.addAttribute("reviews", List.of()); // 빈 리스트로 임시 처리

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
