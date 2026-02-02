package com.aloha.teamproject.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.teamproject.dto.TutorAvailability;

@Mapper
public interface TutorAvailabilityMapper {

    /**
     * 튜터의 특정 기간 가용 시간 조회
     */
    List<TutorAvailability> selectByUserIdAndDateRange(
            @Param("userId") String userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * 가용 시간 추가
     */
    int insert(TutorAvailability availability);

    /**
     * 가용 시간 일괄 추가
     */
    int insertBatch(@Param("list") List<TutorAvailability> availabilities);

    /**
     * 가용 시간 상태 변경
     */
    int updateStatus(
            @Param("id") String id,
            @Param("status") String status
    );

    /**
     * 가용 시간 삭제
     */
    int deleteById(@Param("id") String id);

    /**
     * 튜터의 특정 기간 가용 시간 모두 삭제
     */
    int deleteByUserIdAndDateRange(
            @Param("userId") String userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
