package com.aloha.teamproject.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.LanguageField;
import com.aloha.teamproject.dto.MonthlyEarning;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.dto.TutorReview;
import com.aloha.teamproject.dto.TutorStats;
import com.aloha.teamproject.dto.UpcomingLesson;
import com.aloha.teamproject.mapper.TutorMyPageMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TutorMyPageServiceImpl extends BaseServiceImpl implements TutorMyPageService {

	private final TutorMyPageMapper tutorMyPageMapper;

	@Override
	public TutorProfile selectTutorProfileByUserId(String userId) throws Exception {
		return tutorMyPageMapper.selectTutorProfileByUserId(userId);
	}

	@Override
	public List<LanguageField> selectTutorFieldsByUserId(String userId) throws Exception {
		return tutorMyPageMapper.selectTutorFieldsByUserId(userId);
	}

	@Override
	public List<UpcomingLesson> selectUpcomingBookingsByUserId(String userId) throws Exception {
		return tutorMyPageMapper.selectUpcomingBookingsByUserId(userId);
	}

	@Override
	public List<TutorReview> selectTutorReviewsByUserId(String userId) throws Exception {
		return tutorMyPageMapper.selectTutorReviewsByUserId(userId);
	}

	@Override
	public TutorStats selectTutorStatsByUserId(String userId) throws Exception {
		return tutorMyPageMapper.selectTutorStatsByUserId(userId);
	}

	@Override
	public List<MonthlyEarning> selectMonthlyEarningsByUserId(String userId) throws Exception {
		return tutorMyPageMapper.selectMonthlyEarningsByUserId(userId);
	}
	
}
