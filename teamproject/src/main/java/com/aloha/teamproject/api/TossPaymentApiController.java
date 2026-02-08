package com.aloha.teamproject.api;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.service.TossPaymentService;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments/toss")
public class TossPaymentApiController {

    private final TossPaymentService tossPaymentService;

    @PostMapping("/confirm")
    public ApiResponse<Void> confirm(@RequestBody TossConfirmRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ApiResponse.error("로그인이 필요합니다.");
        }

        try {
            String userId = authentication.getName();
            tossPaymentService.confirmAndPay(
                request.getPaymentKey(),
                request.getOrderId(),
                request.getAmount(),
                userId
            );
            return ApiResponse.ok(SuccessCode.OK);
        } catch (Exception e) {
            log.error("[Toss Confirm API] 실패", e);
            return ApiResponse.error(e.getMessage() != null ? e.getMessage() : "결제 확인에 실패했습니다.");
        }
    }

    @Data
    public static class TossConfirmRequest {
        private String paymentKey;
        private String orderId;
        private Long amount;
    }
}
