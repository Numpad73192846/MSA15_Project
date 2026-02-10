package com.aloha.teamproject.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.aloha.teamproject.config.TossPaymentsProperties;
import com.aloha.teamproject.dto.Booking;
import com.aloha.teamproject.dto.Lesson;
import com.aloha.teamproject.dto.TutorAvailability;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TossPaymentServiceImpl implements TossPaymentService {

    private static final String CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

    private final TossPaymentsProperties properties;
    private final BookingService bookingService;
    private final LessonService lessonService;
    private final TutorAvailabilityService tutorAvailabilityService;

    private final RestTemplate restTemplate = new RestTemplate();

    public void confirmAndPay(String paymentKey, String orderId, Long amount, String userId) throws Exception {
        if (paymentKey == null || paymentKey.isBlank()) {
            throw new IllegalArgumentException("paymentKey가 필요합니다.");
        }
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("orderId가 필요합니다.");
        }
        if (amount == null) {
            throw new IllegalArgumentException("amount가 필요합니다.");
        }

        String bookingId = extractBookingId(orderId);
        Booking booking = bookingService.selectById(bookingId);
        if (booking == null) {
            throw new IllegalArgumentException("예약을 찾을 수 없습니다.");
        }
        if (userId != null && !userId.equals(booking.getUserId())) {
            throw new IllegalArgumentException("결제 권한이 없습니다.");
        }

        Lesson lesson = lessonService.selectById(booking.getLessonId());
        BigDecimal expectedAmount = null;
        if (lesson != null && lesson.getPrice() != null) {
            TutorAvailability availability = tutorAvailabilityService.selectById(booking.getAvailabilityId());
            long minutes = 30L;
            if (availability != null && availability.getStartAt() != null && availability.getEndAt() != null) {
                long diff = java.time.temporal.ChronoUnit.MINUTES.between(availability.getStartAt(), availability.getEndAt());
                if (diff > 0) {
                    minutes = diff;
                }
            }
            long slotCount = Math.max(1L, minutes / 30L);
            expectedAmount = lesson.getPrice().multiply(BigDecimal.valueOf(slotCount));
        }
        BigDecimal paidAmount = BigDecimal.valueOf(amount);

        if (expectedAmount != null && expectedAmount.compareTo(paidAmount) != 0) {
            throw new IllegalArgumentException("결제 금액이 일치하지 않습니다.");
        }

        confirmWithToss(paymentKey, orderId, amount);

        bookingService.payBooking(bookingId, paidAmount, "TOSS");
    }

    public void confirmWithToss(String paymentKey, String orderId, Long amount) {
        String secretKey = properties.getSecretKey();
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("토스 시크릿 키가 설정되지 않았습니다.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(secretKey, "");

        Map<String, Object> body = new HashMap<>();
        body.put("paymentKey", paymentKey);
        body.put("orderId", orderId);
        body.put("amount", amount);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(CONFIRM_URL, entity, Map.class);
            log.info("[Toss Confirm] status: {}", response.getStatusCode());
        } catch (HttpStatusCodeException e) {
            log.error("[Toss Confirm Fail] status: {}, body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new IllegalStateException("토스 결제 승인에 실패했습니다.");
        }
    }

    public String extractBookingId(String orderId) {
        int idx = orderId.indexOf('_');
        if (idx > 0) {
            return orderId.substring(0, idx);
        }
        return orderId;
    }
}
