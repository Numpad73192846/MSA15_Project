package com.aloha.teamproject.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UpcomingLesson {
	
	private String bookingId;
	private String lessonId;
	private String studentId;
	private String studentName;
	private String subjectName;
	private LocalDateTime startAt;
	private LocalDateTime endAt;
	private String status;
	private BigDecimal price;

}
