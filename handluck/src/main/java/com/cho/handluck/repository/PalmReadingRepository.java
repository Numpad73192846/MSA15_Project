package com.cho.handluck.repository;

import com.cho.handluck.domain.PalmReading;
import com.cho.handluck.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 손금 분석 결과 Repository
 */
@Repository
public interface PalmReadingRepository extends JpaRepository<PalmReading, Long> {

    /**
     * 공유 코드로 손금 결과 조회
     */
    Optional<PalmReading> findByShareCode(String shareCode);

    /**
     * 사용자의 손금 결과 목록 조회 (최신순)
     */
    List<PalmReading> findByUserOrderByCreatedAtDesc(User user);

    /**
     * 사용자의 결제 완료된 손금 결과 목록 조회
     */
    List<PalmReading> findByUserAndPaidTrueOrderByCreatedAtDesc(User user);
}
