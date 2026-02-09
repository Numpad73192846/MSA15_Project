package com.cho.handluck.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 손금 분석 결과 엔티티
 * 사용자의 손금 분석 결과와 공유 정보를 저장합니다.
 */
@Entity
@Table(name = "palm_readings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PalmReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 분석 요청한 사용자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 공유용 고유 코드 (URL에 사용) */
    @Column(nullable = false, unique = true, length = 36)
    private String shareCode;

    /** 손금 이미지 경로 */
    @Column
    private String palmImagePath;

    /** 분석 결과 - 생명선 */
    @Column(columnDefinition = "TEXT")
    private String lifeLine;

    /** 분석 결과 - 두뇌선 */
    @Column(columnDefinition = "TEXT")
    private String headLine;

    /** 분석 결과 - 감정선 */
    @Column(columnDefinition = "TEXT")
    private String heartLine;

    /** 분석 결과 - 운명선 */
    @Column(columnDefinition = "TEXT")
    private String fateLine;

    /** 분석 결과 - 종합 해석 */
    @Column(columnDefinition = "TEXT")
    private String overallReading;

    /** 분석 결과 - 한줄 요약 (공유시 티저로 사용) */
    @Column(length = 200)
    private String summary;

    /** 분석 결과 - 행운 점수 (1-100) */
    @Column
    private Integer luckScore;

    /** 결제 금액 */
    @Column(nullable = false)
    private Integer price;

    /** 결제 완료 여부 */
    @Column(nullable = false)
    private boolean paid;

    /** 공유 횟수 */
    @Column(nullable = false)
    private int shareCount;

    /** 공유 페이지 조회 횟수 */
    @Column(nullable = false)
    private int viewCount;

    /** 생성일시 */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** 결제일시 */
    @Column
    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (shareCode == null) {
            shareCode = UUID.randomUUID().toString().substring(0, 8);
        }
        if (price == null) {
            price = 400; // 기본 가격 400원
        }
    }

    /**
     * 결제 완료 처리
     */
    public void completePay() {
        this.paid = true;
        this.paidAt = LocalDateTime.now();
    }

    /**
     * 공유 횟수 증가
     */
    public void incrementShareCount() {
        this.shareCount++;
    }

    /**
     * 조회 횟수 증가
     */
    public void incrementViewCount() {
        this.viewCount++;
    }
}
