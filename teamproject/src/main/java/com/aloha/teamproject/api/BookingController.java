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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.Booking;
import com.aloha.teamproject.dto.Lesson;
import com.aloha.teamproject.dto.StudentBooking;
import com.aloha.teamproject.dto.TutorAvailability;
import com.aloha.teamproject.service.BookingService;
import com.aloha.teamproject.service.LessonService;
import com.aloha.teamproject.service.MemberMyPageService;
import com.aloha.teamproject.service.TutorAvailabilityService;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

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
    private final MemberMyPageService memberMyPageService;

    @GetMapping
    public ApiResponse<List<Booking>> getAllBookings(Authentication authentication) {
        log.info("[예약 목록 조회 시작]");
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[예약 목록 조회] 인증 실패 - authentication is null or not authenticated");
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            log.info("[예약 목록 조회] userId: {}", userId);
            List<Booking> bookings = bookingService.selectByUserId(userId);
            log.info("[예약 목록 조회 성공] 조회된 예약 수: {}", bookings.size());
            return ApiResponse.ok(bookings);
        } catch (Exception e) {
            log.error("[예약 목록 조회 실패]", e);
            return ApiResponse.error("예약 목록을 조회하지 못했습니다.");
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<Booking> getBooking(@PathVariable("id") String id, Authentication authentication) {
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

    @GetMapping("/student/{studentId}")
    public ApiResponse<List<StudentBooking>> getStudentPastBookings(@PathVariable("studentId") String studentId, @RequestParam(name = "tutorId", required = false) String tutorId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            List<StudentBooking> pastBookings = memberMyPageService.selectPastBookings(studentId);
            
            // tutorId로 필터링하면 해당 튜터와의 예약만 반환
            if (tutorId != null && !tutorId.isEmpty()) {
                pastBookings = pastBookings.stream()
                    .filter(b -> tutorId.equals(b.getTutorId()))
                    .collect(Collectors.toList());
            }
            
            return ApiResponse.ok(pastBookings);
        } catch (Exception e) {
            log.error("학생 과거 예약 조회 실패", e);
            return ApiResponse.error("예약을 조회하지 못했습니다.");
        }
    }

    @PostMapping
    public ApiResponse<Void> createBooking(@RequestBody Booking.Request request, Authentication authentication) {
        log.info("[예약 생성 시작]");
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[예약 생성] 인증 실패");
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            log.info("[예약 생성] userId: {}, request: {}", userId, request);
            Booking booking = Booking.builder()
                .userId(userId)
                .lessonId(request.getLessonId())
                .availabilityId(request.getAvailabilityId())
                .title(request.getTitle())
                .memo(request.getMemo())
                .build();

            log.info("[예약 생성] booking 객체: {}", booking);
            bookingService.insert(booking);
            log.info("[예약 생성 성공] bookingId: {}", booking.getId());
            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("[예약 생성 실패]", e);
            return ApiResponse.error("예약을 생성하지 못했습니다.");
        }
    }

    @PutMapping("/{id}/confirm")
    public ApiResponse<Void> confirmBooking(@PathVariable("id") String id, Authentication authentication) {
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
    public ApiResponse<Void> cancelBooking(@PathVariable("id") String id, Authentication authentication) {
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
    public ApiResponse<Void> completeBooking(@PathVariable("id") String id, Authentication authentication) {
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
    public ApiResponse<Void> deleteBooking(@PathVariable("id") String id, Authentication authentication) {
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
            @PathVariable("tutorId") String tutorId,
            @RequestBody TutorBookingRequest request,
            Authentication authentication) {
        log.info("[튜터 예약 생성 시작] tutorId: {}", tutorId);
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[튜터 예약 생성] 인증 실패");
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String studentId = authentication.getName();
            log.info("[튜터 예약 생성] studentId: {}, request: {}", studentId, request);
            
            // 날짜/시간으로 튜터의 availability 찾기
            LocalDateTime startAt = LocalDateTime.parse(request.getDate() + "T" + request.getTime() + ":00");
            LocalDateTime endAt = startAt.plusMinutes(30);
            log.info("[튜터 예약 생성] 시간 범위 - startAt: {}, endAt: {}", startAt, endAt);
            
            List<TutorAvailability> availabilities = tutorAvailabilityService.selectByUserIdAndDateRange(
                tutorId, startAt, endAt);
            List<TutorAvailability> availableSlots = availabilities.stream()
                .filter(av -> av.getStatus() == TutorAvailability.Status.OPEN)
                .filter(av -> !av.getStartAt().isAfter(startAt) && !av.getEndAt().isBefore(endAt))
                .toList();
            log.info("[튜터 예약 생성] availability 조회 결과: {}개", availableSlots.size());
            
            if (availableSlots.isEmpty()) {
                log.warn("[튜터 예약 생성] 선택한 시간에 예약 가능한 슬롯 없음");
                return ApiResponse.error("선택한 시간에 예약 가능한 슬롯이 없습니다.");
            }
            
            TutorAvailability availability = availableSlots.get(0);
            log.info("[튜터 예약 생성] 선택된 availability: {}", availability.getId());
            
            // 튜터의 lesson 찾기 (OPEN 상태인 것), 없으면 자동 생성
            List<Lesson> lessons = lessonService.selectByUserId(tutorId);
            log.info("[튜터 예약 생성] lesson 조회 결과: {}개", lessons.size());
            Lesson lesson = lessons.stream()
                .filter(l -> "OPEN".equals(l.getStatus()))
                .findFirst()
                .orElse(null);
            
            if (lesson == null) {
                log.info("[튜터 예약 생성] OPEN 상태 lesson 없음 - 자동 생성");
                // 튜터의 기본 lesson 자동 생성
                lesson = Lesson.builder()
                    .userId(tutorId)
                    .title(request.getSubject())
                    .description("튜터링 수업")
                    .status("OPEN")
                    .price(java.math.BigDecimal.ZERO)
                    .build();
                lessonService.insert(lesson);
                log.info("[튜터 예약 생성] lesson 자동 생성 완료: {}", lesson.getId());
            } else {
                log.info("[튜터 예약 생성] 기존 lesson 사용: {}", lesson.getId());
            }
            
            // 예약 생성
            Booking booking = Booking.builder()
                .userId(studentId)
                .lessonId(lesson.getId())
                .availabilityId(availability.getId())
                .title(request.getSubject() + " 수업")
                .memo(request.getMessage())
                .build();

            log.info("[튜터 예약 생성] booking 객체 생성: {}", booking);
            bookingService.insert(booking);
            log.info("[튜터 예약 생성] booking DB 저장 완료: {}", booking.getId());
            
            // availability 상태를 BOOKED로 변경
            tutorAvailabilityService.updateStatus(availability.getId(), "BOOKED");
            log.info("[튜터 예약 생성] availability 상태 BOOKED로 변경 완료");
            
            log.info("[튜터 예약 생성 성공] bookingId: {}", booking.getId());
            return ApiResponse.ok(SuccessCode.CREATED);
        } catch (Exception e) {
            log.error("[튜터 예약 생성 실패] tutorId: {}, request: {}", tutorId, request, e);
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

    /**
     * 예약 결제 처리
     */
    @PostMapping("/{id}/pay")
    public ApiResponse<Void> payBooking(
            @PathVariable("id") String id,
            @RequestBody PaymentRequest request,
            Authentication authentication) {
        log.info("[예약 결제 시작] bookingId: {}", id);
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[예약 결제] 인증 실패");
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            log.info("[예약 결제] userId: {}, paymentMethod: {}, amount: {}", 
                userId, request.getPaymentMethod(), request.getAmount());
            
            // 예약 조회
            Booking booking = bookingService.selectById(id);
            if (booking == null) {
                log.warn("[예약 결제] 예약을 찾을 수 없음: {}", id);
                return ApiResponse.error("예약을 찾을 수 없습니다.");
            }
            
            // 본인 예약인지 확인
            if (!userId.equals(booking.getUserId())) {
                log.warn("[예약 결제] 권한 없음 - userId: {}, bookingUserId: {}", userId, booking.getUserId());
                return ApiResponse.error("결제 권한이 없습니다.");
            }
            
            // 결제 처리 (실제 결제 연동은 추후 구현)
            // 여기서는 예약 상태를 PAID로 변경
            bookingService.payBooking(id);
            log.info("[예약 결제 성공] bookingId: {}", id);
            
            return ApiResponse.ok(SuccessCode.OK);
        } catch (Exception e) {
            log.error("[예약 결제 실패] bookingId: {}", id, e);
            return ApiResponse.error("결제 처리에 실패했습니다.");
        }
    }

    @lombok.Data
    public static class PaymentRequest {
        private String paymentMethod;
        private Integer amount;
    }

}
