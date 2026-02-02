package com.aloha.teamproject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.teamproject.dto.Review;

@Mapper
public interface ReviewMapper {
	
	public List<Review> selectReviewsByTutor(String tutorId) throws Exception;

	public Review selectReviewByBookingId(String bookingId) throws Exception;

}
