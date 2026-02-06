package com.aloha.teamproject.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LessonCardItem {

	private String subject;
	private String field;
	private String fieldId;
	private BigDecimal price;

}
