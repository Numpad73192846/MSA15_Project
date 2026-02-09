package com.cho.handluck.service;

import com.cho.handluck.domain.PalmReading;
import com.cho.handluck.domain.User;
import com.cho.handluck.repository.PalmReadingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 손금 분석 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PalmReadingService {

    private final PalmReadingRepository palmReadingRepository;

    /** 손금 분석 기본 가격 */
    public static final int DEFAULT_PRICE = 400;

    /**
     * 새 손금 분석 요청 생성
     */
    @Transactional
    public PalmReading createReading(User user, String palmImagePath) {
        PalmReading reading = PalmReading.builder()
                .user(user)
                .palmImagePath(palmImagePath)
                .price(DEFAULT_PRICE)
                .paid(false)
                .shareCount(0)
                .viewCount(0)
                .build();

        return palmReadingRepository.save(reading);
    }

    /**
     * 손금 분석 결과 저장 (AI 분석 후)
     */
    @Transactional
    public PalmReading saveAnalysisResult(Long readingId, String lifeLine, String headLine,
            String heartLine, String fateLine, String overallReading, String summary, Integer luckScore) {

        PalmReading reading = palmReadingRepository.findById(readingId)
                .orElseThrow(() -> new IllegalArgumentException("손금 분석 결과를 찾을 수 없습니다."));

        reading.setLifeLine(lifeLine);
        reading.setHeadLine(headLine);
        reading.setHeartLine(heartLine);
        reading.setFateLine(fateLine);
        reading.setOverallReading(overallReading);
        reading.setSummary(summary);
        reading.setLuckScore(luckScore);

        return palmReadingRepository.save(reading);
    }

    /**
     * 결제 완료 처리
     */
    @Transactional
    public PalmReading completePay(Long readingId) {
        PalmReading reading = palmReadingRepository.findById(readingId)
                .orElseThrow(() -> new IllegalArgumentException("손금 분석 결과를 찾을 수 없습니다."));

        reading.completePay();
        log.info("결제 완료: readingId={}, userId={}", readingId, reading.getUser().getId());

        return palmReadingRepository.save(reading);
    }

    /**
     * 공유 코드로 손금 결과 조회 (공유 페이지용)
     */
    @Transactional
    public Optional<PalmReading> findByShareCode(String shareCode) {
        Optional<PalmReading> reading = palmReadingRepository.findByShareCode(shareCode);

        // 조회수 증가
        reading.ifPresent(r -> {
            r.incrementViewCount();
            palmReadingRepository.save(r);
        });

        return reading;
    }

    /**
     * 공유 횟수 증가
     */
    @Transactional
    public void incrementShareCount(String shareCode) {
        palmReadingRepository.findByShareCode(shareCode)
                .ifPresent(reading -> {
                    reading.incrementShareCount();
                    palmReadingRepository.save(reading);
                    log.info("공유됨: shareCode={}, 총 공유횟수={}", shareCode, reading.getShareCount());
                });
    }

    /**
     * 사용자의 손금 분석 기록 조회
     */
    public List<PalmReading> getUserReadings(User user) {
        return palmReadingRepository.findByUserAndPaidTrueOrderByCreatedAtDesc(user);
    }

    /**
     * ID로 손금 결과 조회
     */
    public Optional<PalmReading> findById(Long id) {
        return palmReadingRepository.findById(id);
    }

    /**
     * 공유 URL 생성
     */
    public String getShareUrl(PalmReading reading, String baseUrl) {
        return baseUrl + "/share/" + reading.getShareCode();
    }
}
