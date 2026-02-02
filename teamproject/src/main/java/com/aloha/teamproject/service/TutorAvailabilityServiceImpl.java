package com.aloha.teamproject.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.TutorAvailability;
import com.aloha.teamproject.mapper.TutorAvailabilityMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TutorAvailabilityServiceImpl extends BaseServiceImpl implements TutorAvailabilityService {

    private final TutorAvailabilityMapper tutorAvailabilityMapper;

    @Override
    public List<TutorAvailability> selectByUserIdAndDateRange(
            String userId,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) throws Exception {
        requiredNotBlank(userId, ErrorCode.INVALID_REQUEST);
        requireNotNull(startDate, ErrorCode.INVALID_REQUEST);
        requireNotNull(endDate, ErrorCode.INVALID_REQUEST);

        return tutorAvailabilityMapper.selectByUserIdAndDateRange(userId, startDate, endDate);
    }

    @Override
    @Transactional
    public boolean replaceAvailabilities(
            String userId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            List<TutorAvailability> availabilities
    ) throws Exception {
        requiredNotBlank(userId, ErrorCode.INVALID_REQUEST);
        requireNotNull(startDate, ErrorCode.INVALID_REQUEST);
        requireNotNull(endDate, ErrorCode.INVALID_REQUEST);
        requireNotNull(availabilities, ErrorCode.INVALID_REQUEST);

        // 해당 기간의 기존 가용 시간 삭제
        tutorAvailabilityMapper.deleteByUserIdAndDateRange(userId, startDate, endDate);

        // 새 가용 시간이 있으면 추가
        if (!availabilities.isEmpty()) {
            availabilities.forEach(av -> av.setUserId(userId));
            tutorAvailabilityMapper.insertBatch(availabilities);
        }

        return true;
    }

    @Override
    public boolean updateStatus(String id, String status) throws Exception {
        requiredNotBlank(id, ErrorCode.INVALID_REQUEST);
        requiredNotBlank(status, ErrorCode.INVALID_REQUEST);

        int result = tutorAvailabilityMapper.updateStatus(id, status);
        return result > 0;
    }

    @Override
    public boolean deleteById(String id) throws Exception {
        requiredNotBlank(id, ErrorCode.INVALID_REQUEST);

        int result = tutorAvailabilityMapper.deleteById(id);
        return result > 0;
    }
}
