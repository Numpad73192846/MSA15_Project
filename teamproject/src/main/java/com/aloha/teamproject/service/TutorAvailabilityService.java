package com.aloha.teamproject.service;

import java.time.LocalDateTime;
import java.util.List;

import com.aloha.teamproject.dto.TutorAvailability;

public interface TutorAvailabilityService {

    /**
     * 튜터의 특정 기간 가용 시간 조회
     */
    List<TutorAvailability> selectByUserIdAndDateRange(
            String userId,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) throws Exception;

    /**
     * 가용 시간 일괄 저장 (기존 기간 삭제 후 재생성)
     */
    boolean replaceAvailabilities(
            String userId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            List<TutorAvailability> availabilities
    ) throws Exception;

    /**
     * 가용 시간 상태 변경 (예약 처리 등)
     */
    boolean updateStatus(String id, String status) throws Exception;

    /**
     * 가용 시간 삭제
     */
    boolean deleteById(String id) throws Exception;
}
