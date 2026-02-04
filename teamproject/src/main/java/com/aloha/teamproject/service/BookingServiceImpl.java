package com.aloha.teamproject.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.Booking;
import com.aloha.teamproject.mapper.BookingMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl extends BaseServiceImpl implements BookingService {

    private final BookingMapper bookingMapper;

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

}
