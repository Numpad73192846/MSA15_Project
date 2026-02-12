package com.aloha.teamproject.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.aloha.teamproject.config.OpenAiProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiAssistantServiceImpl implements AiAssistantService {

    private final OpenAiProperties openAiProperties;
    private final RestTemplate restTemplate;

    @Override
    public String generateLessonSummary(
            String tutorName,
            String studentName,
            String subject,
            String lessonContext) throws Exception {

        if (lessonContext == null || lessonContext.trim().isEmpty()) {
            throw new IllegalArgumentException("요약할 수업 내용이 없습니다.");
        }

        String systemPrompt = """
                너는 한국어로 작성하는 수업 코치다.
                입력된 수업 내용을 바탕으로 학습자가 다시 보기 쉬운 수업 요약을 만들어라.
                과장 없이 핵심 위주로 간결하게 작성한다.
                """;

        String userPrompt = buildLessonSummaryPrompt(tutorName, studentName, subject, lessonContext);
        String aiText = requestOpenAi(systemPrompt, userPrompt);

        if (aiText == null || aiText.isBlank()) {
            return buildFallbackLessonSummary(subject, lessonContext);
        }
        return aiText.trim();
    }

    @Override
    public String generateHomework(
            String tutorName,
            String studentName,
            String subject,
            String lessonContext) throws Exception {

        if (lessonContext == null || lessonContext.trim().isEmpty()) {
            throw new IllegalArgumentException("과제를 생성할 수업 내용이 없습니다.");
        }

        String systemPrompt = """
                너는 한국어로 작성하는 학습 설계 코치다.
                입력된 수업 내용을 바탕으로 실습 가능한 과제를 만들어라.
                과제는 학습자가 바로 수행할 수 있도록 구체적으로 작성한다.
                """;

        String userPrompt = buildHomeworkPrompt(tutorName, studentName, subject, lessonContext);
        String aiText = requestOpenAi(systemPrompt, userPrompt);

        if (aiText == null || aiText.isBlank()) {
            return buildFallbackHomework(subject, lessonContext);
        }
        return aiText.trim();
    }

    private String requestOpenAi(String systemPrompt, String userPrompt) {
        String apiKey = openAiProperties.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            return null;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", openAiProperties.getModel());
            body.put("temperature", openAiProperties.getTemperature());
            body.put("max_tokens", openAiProperties.getMaxTokens());

            List<Map<String, Object>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userPrompt));
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(openAiProperties.getApiUrl(), entity, Map.class);
            return extractAssistantMessage(response.getBody());
        } catch (HttpStatusCodeException e) {
            log.error("[AI] OpenAI 호출 실패 status={}, body={}", e.getStatusCode().value(), e.getResponseBodyAsString());

            if (e.getStatusCode().value() == 401) {
                log.error("[AI] Unauthorized. Check OPENAI_API_KEY / billing / project setting.");
            }
            
            if (e.getStatusCode().value() == 429) {
                log.error("[AI] Rate limited or quota exceeded.");
            }
            return null;
        } catch (Exception e) {
            log.error("[AI] OpenAI 호출 실패", e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private String extractAssistantMessage(Map responseBody) {
        if (responseBody == null) {
            return null;
        }

        Object choicesObj = responseBody.get("choices");
        if (!(choicesObj instanceof List<?> choices) || choices.isEmpty()) {
            return null;
        }

        Object firstChoiceObj = choices.get(0);
        if (!(firstChoiceObj instanceof Map<?, ?> firstChoice)) {
            return null;
        }

        Object messageObj = firstChoice.get("message");
        if (!(messageObj instanceof Map<?, ?> messageMap)) {
            return null;
        }

        Object contentObj = messageMap.get("content");
        if (!(contentObj instanceof String content)) {
            return null;
        }
        return content;
    }

    private String buildLessonSummaryPrompt(String tutorName, String studentName, String subject, String lessonContext) {
        String safeTutor = normalizeOrDefault(tutorName, "튜터");
        String safeStudent = normalizeOrDefault(studentName, "학습자");
        String safeSubject = normalizeOrDefault(subject, "수업");

        return """
                아래 수업 정보를 바탕으로 '수업 요약'을 작성해줘.
                - 튜터: %s
                - 학습자: %s
                - 과목/주제: %s

                작성 형식:
                1) 오늘 수업 핵심 요약 (3~5줄)
                2) 학습 포인트 (불릿 3개)
                3) 다음 수업 전 복습 체크리스트 (불릿 3개)

                수업 내용:
                %s
                """.formatted(safeTutor, safeStudent, safeSubject, lessonContext);
    }

    private String buildHomeworkPrompt(String tutorName, String studentName, String subject, String lessonContext) {
        String safeTutor = normalizeOrDefault(tutorName, "튜터");
        String safeStudent = normalizeOrDefault(studentName, "학습자");
        String safeSubject = normalizeOrDefault(subject, "수업");

        return """
                아래 수업 정보를 바탕으로 과제를 설계해줘.
                - 튜터: %s
                - 학습자: %s
                - 과목/주제: %s

                작성 형식:
                1) 과제 목표 (2~3줄)
                2) 과제 목록 (번호 3~5개, 각 항목은 '설명/제출 형태/권장 소요시간' 포함)
                3) 평가 기준 (불릿 3개)

                수업 내용:
                %s
                """.formatted(safeTutor, safeStudent, safeSubject, lessonContext);
    }

    private String buildFallbackLessonSummary(String subject, String lessonContext) {
        String safeSubject = normalizeOrDefault(subject, "수업");
        String snippet = toSnippet(lessonContext, 280);
        return """
                [AI 수업 요약]
                과목/주제: %s

                1) 오늘 수업 핵심 요약
                - %s

                2) 학습 포인트
                - 핵심 개념을 문장으로 다시 설명해보기
                - 오늘 다룬 표현/문법을 예문에 적용해보기
                - 헷갈린 지점을 체크하고 질문 목록 만들기

                3) 다음 수업 전 복습 체크리스트
                - 수업 노트 1회 정독
                - 주요 포인트 3개 암기/정리
                - 다음 수업 질문 2개 준비
                """.formatted(safeSubject, snippet);
    }

    private String buildFallbackHomework(String subject, String lessonContext) {
        String safeSubject = normalizeOrDefault(subject, "수업");
        String snippet = toSnippet(lessonContext, 220);
        return """
                [AI 과제 초안]
                과목/주제: %s

                1) 과제 목표
                - 오늘 수업에서 다룬 핵심 개념을 스스로 설명할 수 있도록 연습합니다.
                - 수업 내용을 실제 문제 풀이/문장 작성에 적용합니다.

                2) 과제 목록
                1. 핵심 개념 요약 노트 작성
                - 설명: 오늘 수업 내용을 10줄 내로 정리
                - 제출 형태: 텍스트
                - 권장 시간: 15분

                2. 적용 문제/문장 5개 작성
                - 설명: 수업 내용(참고: %s)을 적용한 예시 만들기
                - 제출 형태: 텍스트
                - 권장 시간: 20분

                3. 오답/헷갈린 포인트 정리
                - 설명: 어려웠던 부분 3개와 이유 작성
                - 제출 형태: 체크리스트 + 짧은 메모
                - 권장 시간: 10분

                3) 평가 기준
                - 핵심 개념을 정확히 이해했는지
                - 예시/문제 적용이 적절한지
                - 헷갈린 포인트를 구체적으로 정리했는지
                """.formatted(safeSubject, snippet);
    }

    private String normalizeOrDefault(String value, String fallback) {
        if (value == null) return fallback;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? fallback : trimmed;
    }

    private String toSnippet(String text, int maxLength) {
        if (text == null || text.isBlank()) {
            return "수업 핵심 내용을 기반으로 요약이 생성되었습니다.";
        }
        String normalized = text.replaceAll("\\s+", " ").trim();
        if (normalized.length() <= maxLength) {
            return normalized;
        }
        return normalized.substring(0, maxLength) + "...";
    }
}

