package com.cho.handluck.controller;

import com.cho.handluck.domain.PalmReading;
import com.cho.handluck.service.PalmReadingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 공유 페이지 컨트롤러
 * 손금 결과 공유 및 공유 페이지 표시를 담당합니다.
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ShareController {

    private final PalmReadingService palmReadingService;

    /**
     * 공유된 손금 결과 페이지 (비로그인도 접근 가능)
     * - 결과의 일부만 보여주고 (티저)
     * - "나도 손금 보기" 버튼으로 결제 유도
     */
    @GetMapping("/share/{shareCode}")
    public String viewSharedReading(@PathVariable String shareCode, Model model, HttpServletRequest request) {
        log.info("공유 페이지 접근: shareCode={}", shareCode);

        return palmReadingService.findByShareCode(shareCode)
                .map(reading -> {
                    model.addAttribute("reading", reading);
                    model.addAttribute("shareUrl", getBaseUrl(request) + "/share/" + shareCode);
                    model.addAttribute("price", PalmReadingService.DEFAULT_PRICE);
                    return "share/view";
                })
                .orElse("share/not-found");
    }

    /**
     * 공유 버튼 클릭 시 공유 횟수 증가 API
     */
    @PostMapping("/api/share/{shareCode}/track")
    @ResponseBody
    public String trackShare(@PathVariable String shareCode) {
        palmReadingService.incrementShareCount(shareCode);
        return "ok";
    }

    /**
     * 서버 기본 URL 추출
     */
    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();

        if ((scheme.equals("http") && serverPort == 80) ||
                (scheme.equals("https") && serverPort == 443)) {
            return scheme + "://" + serverName;
        }
        return scheme + "://" + serverName + ":" + serverPort;
    }
}
