package com.aloha.teamproject.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.Booking;
import com.aloha.teamproject.dto.Payment;
import com.aloha.teamproject.mapper.BookingMapper;
import com.aloha.teamproject.mapper.PaymentMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl extends BaseServiceImpl implements BookingService {

    private final BookingMapper bookingMapper;
    private final PaymentMapper paymentMapper;

    @Override
    public List<Booking> selectAll() throws Exception {
        return bookingMapper.selectAll();
    }

    @Override
    public Booking selectById(String id) throws Exception {
        return bookingMapper.selectById(id);
    }

    @Override
    public List<Booking> selectByUserId(String userId) throws Exception {
        return bookingMapper.selectByUserId(userId);
    }

    @Override
    public List<Booking> selectByTutorId(String tutorId) throws Exception {
        return bookingMapper.selectByTutorId(tutorId);
    }

    @Override
    @Transactional
    public int insert(Booking booking) throws Exception {
        return bookingMapper.insert(booking);
    }

    @Override
    @Transactional
    public int update(Booking booking) throws Exception {
        return bookingMapper.update(booking);
    }

    @Override
    @Transactional
    public int delete(String id) throws Exception {
        return bookingMapper.delete(id);
    }

    @Override
    @Transactional
    public int confirmBooking(String id) throws Exception {
        return bookingMapper.confirmBooking(id);
    }

    @Override
    @Transactional
    public int cancelBooking(String id) throws Exception {
        return bookingMapper.cancelBooking(id);
    }

    @Override
    @Transactional
    public int completeBooking(String id) throws Exception {
        return bookingMapper.completeBooking(id);
    }

    @Override
    @Transactional
    public int payBooking(String id) throws Exception {
        // 예약 조회
        Booking booking = bookingMapper.selectById(id);
        if (booking == null) {
            throw new Exception("예약을 찾을 수 없습니다.");
        }
        
        // 이미 결제된 예약인지 확인
        Payment existingPayment = paymentMapper.selectByBookingId(id);
        if (existingPayment != null) {
            throw new Exception("이미 결제된 예약입니다.");
        }
        
        // 결제 정보 생성
        Payment payment = Payment.builder()
            .userId(booking.getUserId())
            .bookingId(id)
            .amount(BigDecimal.ZERO) // 실제 금액은 API에서 전달받아야 함
            .provider("CARD")
            .status("PAID")
            .paidAt(LocalDateTime.now())
            .build();
        
        return paymentMapper.insert(payment);
    }

}
