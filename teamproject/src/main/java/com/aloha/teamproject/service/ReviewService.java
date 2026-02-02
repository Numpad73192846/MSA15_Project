package com.aloha.teamproject.service;

import java.util.List;

import com.aloha.teamproject.dto.Review;

public interface ReviewService {
	
	public List<Review> selectReviewsByTutor(String tutorId) throws Exception;

	public Review selectReviewByBookingId(String bookingId) throws Exception;

}
