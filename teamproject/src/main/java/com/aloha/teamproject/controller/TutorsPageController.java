package com.aloha.teamproject.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.aloha.teamproject.dto.Review;
import com.aloha.teamproject.dto.TutorList;
import com.aloha.teamproject.dto.UpcomingLesson;
import com.aloha.teamproject.service.ReviewService;
import com.aloha.teamproject.service.TutorListService;
import com.aloha.teamproject.service.TutorMyPageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class TutorsPageController {

    private final TutorListService tutorListService;
    private final ReviewService reviewService;
    private final TutorMyPageService tutorMyPageService;

    @GetMapping("/tutors")
    public String tutors(Authentication authentication, Model model) {
        try {
            List<TutorList> tutors = tutorListService.selectAllTutors();
            
            // 각 튜터의 리뷰 평점 계산
            for (TutorList tutor : tutors) {
                List<Review> reviews = reviewService.selectReviewsByTutor(tutor.getUserId());
                
                double avgRating = 0.0;
                if (!reviews.isEmpty()) {
                    avgRating = reviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);
                }
                
                tutor.setRatingAvg(BigDecimal.valueOf(Math.round(avgRating * 10.0) / 10.0));
                tutor.setReviewCount(reviews.size());
            }
            
            model.addAttribute("tutors", tutors);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "tutors/list";
    }

    @GetMapping("/tutors/{id}")
    public String tutorDetail(@PathVariable("id") String id, Model model) {

        try {

            TutorList tutor = tutorListService.selectTutorById(id);

            if ( tutor == null ) {
                return "redirect:/tutors";
            }

            Map<String, Object> tutorMap = new HashMap<>();
            tutorMap.put("userId", tutor.getUserId());
            tutorMap.put("name", tutor.getName() != null ? tutor.getName() : "");
            tutorMap.put("ratingAvg", tutor.getRatingAvg() != null ? tutor.getRatingAvg() : 0.0);
            tutorMap.put("reviewCount", tutor.getReviewCount() != null ? tutor.getReviewCount() : 0);
            tutorMap.put("subjects", tutor.getSubjects() != null ? tutor.getSubjects() : "");
            tutorMap.put("bio", tutor.getBio() != null ? tutor.getBio() : "");
            tutorMap.put("selfIntro", tutor.getSelfIntro() != null ? tutor.getSelfIntro() : "");
            tutorMap.put("experience", tutor.getExperience() != null ? tutor.getExperience() : "");
            tutorMap.put("price", tutor.getPrice() != null ? tutor.getPrice() : 0);
            tutorMap.put("availability", "평일 저녁, 주말");

            List<Review> reviews = reviewService.selectReviewsByTutor(tutor.getUserId());
            
            // 리뷰 평점 계산
            double avgRating = 0.0;
            if (!reviews.isEmpty()) {
                avgRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            }
            
            model.addAttribute("tutor", tutorMap);
            model.addAttribute("reviews", reviews);
            model.addAttribute("avgRating", BigDecimal.valueOf(Math.round(avgRating * 10.0) / 10.0));
            model.addAttribute("reviewCount", reviews.size());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "tutors/detail";
    }

        @GetMapping("/tutor/dashboard")
    public String tutorDashboard(Model model, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }

        try {
            String userId = authentication.getName();
            
            // 예약 목록 조회 (대기중 + 확정 상태)
            List<UpcomingLesson> upcomingLessons = tutorMyPageService.selectUpcomingBookingsByUserId(userId);
            
            // 대시보드용 예약 데이터 변환
            List<java.util.Map<String, Object>> bookings = upcomingLessons.stream().map(lesson -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", lesson.getBookingId());
                map.put("studentName", lesson.getStudentName());
                map.put("subject", lesson.getSubject());
                String status = "PENDING".equals(lesson.getStatus()) ? "대기중" : 
                               "CONFIRMED".equals(lesson.getStatus()) ? "확정" : "취소";
                map.put("status", status);
                map.put("date", lesson.getLessonDate());
                map.put("time", lesson.getStartTime());
                map.put("duration", lesson.getDurationHours());
                map.put("totalPrice", lesson.getPrice() != null ? lesson.getPrice().intValue() : 0);
                return map;
            }).toList();
            
            // 학생 목록은 예약에서 추출 (중복 제거)
            java.util.Map<String, java.util.Map<String, Object>> studentMap = new java.util.LinkedHashMap<>();
            for (UpcomingLesson lesson : upcomingLessons) {
                String studentId = lesson.getStudentId();
                if (!studentMap.containsKey(studentId)) {
                    java.util.Map<String, Object> student = new java.util.HashMap<>();
                    student.put("name", lesson.getStudentName());
                    student.put("email", "");
                    student.put("phone", "");
                    student.put("subjects", new java.util.ArrayList<String>());
                    student.put("totalSessions", 0);
                    student.put("lastSession", lesson.getLessonDate());
                    student.put("progress", "");
                    student.put("notes", "");
                    studentMap.put(studentId, student);
                }
                @SuppressWarnings("unchecked")
                java.util.List<String> subjects = (java.util.List<String>) studentMap.get(studentId).get("subjects");
                if (!subjects.contains(lesson.getSubject())) {
                    subjects.add(lesson.getSubject());
                }
                studentMap.get(studentId).put("totalSessions", 
                    (Integer) studentMap.get(studentId).get("totalSessions") + 1);
            }
            
            model.addAttribute("bookings", bookings);
            model.addAttribute("students", new java.util.ArrayList<>(studentMap.values()));
        } catch (Exception e) {
            log.error("튜터 대시보드 데이터 조회 실패", e);
            model.addAttribute("bookings", List.of());
            model.addAttribute("students", List.of());
        }
        
        return "tutor/dashboard";
    }
    
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

}
