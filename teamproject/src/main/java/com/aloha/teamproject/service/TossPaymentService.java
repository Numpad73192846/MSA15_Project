package com.aloha.teamproject.service;

public interface TossPaymentService {

    public void confirmAndPay(String paymentKey, String orderId, Long amount, String userId) throws Exception;

    public void confirmWithToss(String paymentKey, String orderId, Long amount) throws Exception;

    public String extractBookingId(String orderId) throws Exception;
    
}