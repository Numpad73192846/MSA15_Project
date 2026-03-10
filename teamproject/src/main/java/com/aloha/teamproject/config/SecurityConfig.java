package com.aloha.teamproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.aloha.teamproject.security.JwtAuthenticationFilter;
import com.aloha.teamproject.service.auth.CustomOAuth2UserService;
import com.aloha.teamproject.security.handler.OAuth2AuthenticationSuccessHandler;
import com.aloha.teamproject.security.handler.OAuth2AuthenticationFailureHandler;
import com.aloha.teamproject.service.UserDetailServiceImpl;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailServiceImpl userDetailServiceImpl;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2FailureHandler;

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
            .requestMatchers("/favicon.ico", "/error");
    }

    // 비밀번호 암호화 빈 설정
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS 설정 빈
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 허용할 출처 (Origin) 설정
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"
        ));
        
        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // 허용할 요청 헤더
        configuration.setAllowedHeaders(List.of("*"));
        
        // 자격증명(쿠키, Authorization 헤더) 포함 허용
        configuration.setAllowCredentials(true);
        
        // preflight 요청 캐시 시간 (초 단위)
        configuration.setMaxAge(3600L);
        
        // 응답 헤더 노출
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Total-Count"
        ));
        
        // /api/**, /auth/** 경로에 CORS 설정 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        source.registerCorsConfiguration("/auth/**", configuration);
        
        return source;
    }

    // 보안 필터 체인 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // ✅ CORS 설정 활성화
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        // ✅ CSRF 비활성화 (API 전용)
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 공개 API
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tutors/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/validate").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/check-username", "/api/users/check-nickname").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/language-fields").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/game/**").permitAll()
                // 관리자 API
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // 인증 필요 API
                .requestMatchers("/api/bookings/**").hasAnyRole("USER", "TUTOR", "TUTOR_PENDING", "ADMIN")
                .requestMatchers("/api/payments/**").hasAnyRole("USER", "TUTOR", "TUTOR_PENDING", "ADMIN")
                .requestMatchers("/api/inquiries/**").hasAnyRole("USER", "TUTOR", "ADMIN")
                .requestMatchers("/api/tutor/messages/**").hasAnyRole("TUTOR", "USER", "ADMIN")
                .requestMatchers("/api/tutor/students/**").hasAnyRole("TUTOR", "ADMIN")
                .requestMatchers("/api/ai/**").hasAnyRole("USER", "TUTOR", "ADMIN")
                .requestMatchers("/api/tutors/profile", "/api/tutors/me/**").hasAnyRole("USER", "TUTOR", "TUTOR_PENDING")
                .requestMatchers("/api/**").authenticated()
                // 프론트엔드 라우트는 React SPA가 처리
                .anyRequest().permitAll()
            );

        // OAuth2 로그인 설정
        http
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler(oAuth2SuccessHandler)
                .failureHandler(oAuth2FailureHandler)
            );

        // 세션 관리 (OAuth2 사용 시 IF_REQUIRED)
        http
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        // API 요청에 대한 인증 실패 처리 (401 JSON 반환, /login 리다이렉트 방지)
        http.exceptionHandling(ex -> ex
            .authenticationEntryPoint((request, response, authException) -> {
                String uri = request.getRequestURI();
                if (uri.startsWith("/api/")) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"success\":false,\"message\":\"인증이 필요합니다.\"}");
                } else {
                    response.sendRedirect("/login");
                }
            })
            .accessDeniedHandler((request, response, accessDeniedException) -> {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":false,\"message\":\"접근 권한이 없습니다.\"}");
            })
        );

        // JWT 인증 필터 설정
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // 사용자 상세 서비스 설정
        http.userDetailsService(userDetailServiceImpl);

        return http.build();

    }

    // 인증 매니저 빈 설정
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
