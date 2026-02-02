package com.aloha.teamproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.Review;
import com.aloha.teamproject.mapper.ReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl extends BaseServiceImpl implements ReviewService {

	private final ReviewMapper reviewMapper;
	
	@Override
	public List<Review> selectReviewsByTutor(String tutorId) throws Exception {
		return reviewMapper.selectReviewsByTutor(tutorId);
	}

	@Override
	public Review selectReviewByBookingId(String bookingId) throws Exception {
		return reviewMapper.selectReviewByBookingId(bookingId);
	}


	
}
