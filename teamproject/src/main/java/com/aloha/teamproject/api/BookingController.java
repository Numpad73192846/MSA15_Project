package com.aloha.teamproject.api;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.Booking;
import com.aloha.teamproject.dto.Lesson;
import com.aloha.teamproject.dto.TutorAvailability;
import com.aloha.teamproject.service.BookingService;
import com.aloha.teamproject.service.LessonService;
import com.aloha.teamproject.service.TutorAvailabilityService;

import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final TutorAvailabilityService tutorAvailabilityService;
    private final LessonService lessonService;

    @GetMapping
    public ApiResponse<List<Booking>> getAllBookings(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            List<Booking> bookings = bookingService.selectByUserId(authentication.getName());
            return ApiResponse.ok(bookings);
        } catch (Exception e) {
            log.error("예약 목록 조회 실패", e);
            return ApiResponse.error("예약 목록을 조회하지 못했습니다.");
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<Booking> getBooking(@PathVariable String id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            Booking booking = bookingService.selectById(id);
            return ApiResponse.ok(booking);
        } catch (Exception e) {
            log.error("예약 조회 실패", e);
            return ApiResponse.error("예약을 조회하지 못했습니다.");
        }
    }

    @PostMapping
    public ApiResponse<Void> createBooking(@RequestBody Booking.Request request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            Booking booking = Booking.builder()
                .userId(authentication.getName())
                .lessonId(request.getLessonId())
                .availabilityId(request.getAvailabilityId())
                .title(request.getTitle())
                .memo(request.getMemo())
                .build();

            bookingService.insert(booking);
            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("예약 생성 실패", e);
            return ApiResponse.error("예약을 생성하지 못했습니다.");
        }
    }

    @PutMapping("/{id}/confirm")
    public ApiResponse<Void> confirmBooking(@PathVariable String id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            bookingService.confirmBooking(id);
            return ApiResponse.ok(SuccessCode.UPDATED);
        } catch (Exception e) {
            log.error("예약 확정 실패", e);
            return ApiResponse.error("예약을 확정하지 못했습니다.");
        }
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<Void> cancelBooking(@PathVariable String id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            bookingService.cancelBooking(id);
            return ApiResponse.ok(SuccessCode.UPDATED);
        } catch (Exception e) {
            log.error("예약 취소 실패", e);
            return ApiResponse.error("예약을 취소하지 못했습니다.");
        }
    }

    @PutMapping("/{id}/complete")
    public ApiResponse<Void> completeBooking(@PathVariable String id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            bookingService.completeBooking(id);
            return ApiResponse.ok(SuccessCode.UPDATED);
        } catch (Exception e) {
            log.error("예약 완료 처리 실패", e);
            return ApiResponse.error("예약을 완료 처리하지 못했습니다.");
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBooking(@PathVariable String id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            bookingService.delete(id);
            return ApiResponse.ok(SuccessCode.DELETED);
        } catch (Exception e) {
            log.error("예약 삭제 실패", e);
            return ApiResponse.error("예약을 삭제하지 못했습니다.");
        }
    }

    @PostMapping("/tutor/{tutorId}")
    public ApiResponse<Void> createTutorBooking(
            @PathVariable String tutorId,
            @RequestBody TutorBookingRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String studentId = authentication.getName();
            
            // 날짜/시간으로 튜터의 availability 찾기
            LocalDateTime startAt = LocalDateTime.parse(request.getDate() + "T" + request.getTime() + ":00");
            LocalDateTime endAt = startAt.plusMinutes(30);
            
            List<TutorAvailability> availabilities = tutorAvailabilityService.selectByUserIdAndDateRange(
                tutorId, startAt, endAt);
            
            if (availabilities.isEmpty()) {
                return ApiResponse.error("선택한 시간에 예약 가능한 슬롯이 없습니다.");
            }
            
            TutorAvailability availability = availabilities.get(0);
            
            // 튜터의 lesson 찾기 (OPEN 상태인 것), 없으면 자동 생성
            List<Lesson> lessons = lessonService.selectByUserId(tutorId);
            Lesson lesson = lessons.stream()
                .filter(l -> "OPEN".equals(l.getStatus()))
                .findFirst()
                .orElse(null);
            
            if (lesson == null) {
                // 튜터의 기본 lesson 자동 생성
                lesson = Lesson.builder()
                    .userId(tutorId)
                    .title(request.getSubject())
                    .description("튜터링 수업")
                    .status("OPEN")
                    .price(java.math.BigDecimal.ZERO)
                    .build();
                lessonService.insert(lesson);
            }
            
            // 예약 생성
            Booking booking = Booking.builder()
                .userId(studentId)
                .lessonId(lesson.getId())
                .availabilityId(availability.getId())
                .title(request.getSubject() + " 수업")
                .memo(request.getMessage())
                .build();

            bookingService.insert(booking);
            
            // availability 상태를 BOOKED로 변경
            tutorAvailabilityService.updateStatus(availability.getId(), "BOOKED");
            
            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("튜터 예약 생성 실패", e);
            return ApiResponse.error("예약을 생성하지 못했습니다.");
        }
    }

    @lombok.Data
    public static class TutorBookingRequest {
        private String date;
        private String time;
        private String subject;
        private String message;
    }

}
