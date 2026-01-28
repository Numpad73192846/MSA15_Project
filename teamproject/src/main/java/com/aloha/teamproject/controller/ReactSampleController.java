package com.aloha.teamproject.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ReactSampleController {

    @GetMapping("/tutors")
    public String tutors(Model model) {
        model.addAttribute("tutors", mockTutors());
        return "tutors/list";
    }

    @GetMapping("/tutors/{id}")
    public String tutorDetail(@PathVariable("id") String id, Model model) {
        Map<String, Object> tutor = mockTutors().stream()
                .filter(t -> String.valueOf(t.get("id")).equals(id))
                .findFirst()
                .orElse(null);

        if (tutor == null) {
            // 간단 처리: 목록으로 이동
            return "redirect:/tutors";
        }

        model.addAttribute("tutor", tutor);
        model.addAttribute("reviews", mockReviews());
        return "tutors/detail";
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/bookings")
    public String bookings() {
        return "bookings/index";
    }

    @GetMapping("/tutor/dashboard")
    public String tutorDashboard(Model model) {
        model.addAttribute("bookings", mockTutorBookings());
        model.addAttribute("students", mockStudents());
        return "tutor/dashboard";
    }

    private List<Map<String, Object>> mockTutors() {
        List<Map<String, Object>> tutors = new ArrayList<>();

        tutors.add(tutor("1", "김민지", "영어", List.of("영어", "토익", "토플"),
                "미국 유학 5년, TESOL 자격증 보유. 회화부터 시험까지 완벽 대비", 4.9, 127, 35000, "5년", "평일 오후, 주말"));

        tutors.add(tutor("2", "이준호", "수학", List.of("수학", "미적분", "통계"),
                "서울대 수학과 출신. 수능 수학 만점자의 쉬운 설명", 4.8, 94, 40000, "3년", "평일 저녁"));

        tutors.add(tutor("3", "박서연", "프로그래밍", List.of("Python", "Java", "Web개발"),
                "현직 개발자가 알려주는 실전 코딩. 취업까지 완벽 준비", 5.0, 68, 50000, "7년", "주말 전체"));

        tutors.add(tutor("4", "최다은", "과학", List.of("화학", "생물", "물리"),
                "의대생 튜터. 과학 과목 내신부터 수능까지", 4.7, 82, 38000, "2년", "평일 오전"));

        tutors.add(tutor("5", "정우진", "일본어", List.of("일본어", "JLPT", "JPT"),
                "일본 거주 10년. JLPT N1 만점 합격자", 4.9, 105, 32000, "4년", "평일 전체"));

        tutors.add(tutor("6", "강예린", "중국어", List.of("중국어", "HSK", "비즈니스 중국어"),
                "베이징대 졸업. 원어민 수준의 발음 교정", 4.8, 91, 35000, "6년", "주말 오전"));

        return tutors;
    }

    private Map<String, Object> tutor(String id, String name, String subject, List<String> subjects, String bio,
            double rating, int reviews, int hourlyRate, String experience, String availability) {
        Map<String, Object> t = new LinkedHashMap<>();
        t.put("id", id);
        t.put("name", name);
        t.put("subject", subject);
        t.put("subjects", subjects);
        t.put("bio", bio);
        t.put("rating", rating);
        t.put("reviews", reviews);
        t.put("hourlyRate", hourlyRate);
        t.put("experience", experience);
        t.put("availability", availability);
        return t;
    }

    private List<Map<String, Object>> mockReviews() {
        List<Map<String, Object>> reviews = new ArrayList<>();

        reviews.add(review("1", "학생A", 5, "2026-01-20",
                "정말 꼼꼼하게 가르쳐주셔서 많은 도움이 되었습니다. 추천합니다!"));
        reviews.add(review("2", "학생B", 5, "2026-01-15",
                "이해하기 쉽게 설명해주시고 질문에도 친절하게 답변해주셨어요."));
        reviews.add(review("3", "학생C", 4, "2026-01-10", "실력이 많이 늘었습니다. 감사합니다!"));

        return reviews;
    }

    private Map<String, Object> review(String id, String name, int rating, String date, String comment) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("id", id);
        r.put("name", name);
        r.put("rating", rating);
        r.put("date", date);
        r.put("comment", comment);
        return r;
    }

    private List<Map<String, Object>> mockTutorBookings() {
        List<Map<String, Object>> bookings = new ArrayList<>();

        bookings.add(tutorBooking("1", "s1", "김학생", "student1@email.com", "2026-01-30", "14:00", 2,
                "영어", "토익 공부 도와주세요", "대기중", 70000));
        bookings.add(tutorBooking("2", "s2", "이학생", "student2@email.com", "2026-01-28", "16:00", 1,
                "토익", "문법 위주로 부탁드립니다", "확정", 35000));
        bookings.add(tutorBooking("3", "s3", "박학생", "student3@email.com", "2026-01-25", "10:00", 1,
                "토플", "", "완료", 35000));

        return bookings;
    }

    private Map<String, Object> tutorBooking(String id, String studentId, String studentName, String studentEmail,
            String date, String time, int duration, String subject, String message, String status, int totalPrice) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("id", id);
        b.put("studentId", studentId);
        b.put("studentName", studentName);
        b.put("studentEmail", studentEmail);
        b.put("date", date);
        b.put("time", time);
        b.put("duration", duration);
        b.put("subject", subject);
        b.put("message", message);
        b.put("status", status);
        b.put("totalPrice", totalPrice);
        return b;
    }

    private List<Map<String, Object>> mockStudents() {
        List<Map<String, Object>> students = new ArrayList<>();

        students.add(student("s1", "김학생", "student1@email.com", "010-1234-5678", List.of("영어", "토익"),
                12, "2025-12-01", "2026-01-20",
                "토익 목표 점수 800점. 문법이 약하여 집중 보강 필요", "현재 650점에서 720점으로 향상. 꾸준히 발전 중"));

        students.add(student("s2", "이학생", "student2@email.com", "010-2345-6789", List.of("토익"), 8,
                "2025-12-15", "2026-01-22", "듣기 파트에 집중. RC보다 LC 점수가 낮음",
                "LC 점수 50점 향상. 계속해서 듣기 연습 중"));

        students.add(student("s3", "박학생", "student3@email.com", "010-3456-7890", List.of("토플", "영어"),
                5, "2026-01-05", "2026-01-25", "미국 대학 진학 준비. 토플 100점 목표",
                "Speaking과 Writing 집중 학습 시작"));

        students.add(student("s4", "최학생", "student4@email.com", "010-4567-8901", List.of("영어"), 15,
                "2025-11-20", "2026-01-23", "회화 위주 학습. 해외 출장 대비", "비즈니스 영어 실력이 많이 향상됨"));

        return students;
    }

    private Map<String, Object> student(String id, String name, String email, String phone, List<String> subjects,
            int totalSessions, String joinDate, String lastSession, String notes, String progress) {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("id", id);
        s.put("name", name);
        s.put("email", email);
        s.put("phone", phone);
        s.put("subjects", subjects);
        s.put("totalSessions", totalSessions);
        s.put("joinDate", joinDate);
        s.put("lastSession", lastSession);
        s.put("notes", notes);
        s.put("progress", progress);
        return s;
    }
}
