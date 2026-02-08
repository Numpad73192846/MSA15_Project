package com.aloha.teamproject.security.handler;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.aloha.teamproject.model.CustomOAuth2User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 로그인 성공!");

        CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();

        // 신규 사용자 (역할이 GUEST)인 경우, 역할 선택 페이지로 리디렉션
        if ("ROLE_GUEST".equals(oauth2User.getRole())) {
            log.info("신규 사용자입니다. 역할 선택 페이지로 이동합니다.");
            // 세션에 사용자 정보 임시 저장
            HttpSession session = request.getSession();
            session.setAttribute("oauth2UserId", oauth2User.getUserId());
            session.setAttribute("oauth2UserNo", oauth2User.getNo());
            getRedirectStrategy().sendRedirect(request, response, "/auth/login?needsRoleSelection=true");
            return;
        }

        // 기존 사용자인 경우, 홈으로 리디렉션
        log.info("기존 사용자입니다. 홈으로 이동합니다.");
        getRedirectStrategy().sendRedirect(request, response, "/");
    }
}
