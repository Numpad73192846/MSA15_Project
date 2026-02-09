package com.cho.handluck.config;

import com.cho.handluck.oauth2.CustomOAuth2UserService;
import com.cho.handluck.oauth2.OAuth2FailureHandler;
import com.cho.handluck.oauth2.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 설정
 * OAuth2 소셜 로그인(카카오, 네이버, 구글) 및 이메일 로그인을 지원합니다.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2SuccessHandler oAuth2SuccessHandler;
        private final OAuth2FailureHandler oAuth2FailureHandler;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .authorizeHttpRequests(auth -> auth
                                                // 정적 리소스 및 공개 페이지 허용
                                                .requestMatchers(
                                                                "/",
                                                                "/login",
                                                                "/login/email",
                                                                "/signup/**",
                                                                "/share/**",
                                                                "/api/share/**",
                                                                "/css/**",
                                                                "/js/**",
                                                                "/img/**",
                                                                "/favicon.ico",
                                                                "/h2-console/**",
                                                                "/error")
                                                .permitAll()
                                                // 그 외 모든 요청은 인증 필요
                                                .anyRequest().authenticated())
                                // 폼 로그인 설정 (이메일 로그인)
                                .formLogin(form -> form
                                                .loginPage("/login")
                                                .defaultSuccessUrl("/", true)
                                                .failureUrl("/login?error=true")
                                                .permitAll())
                                // OAuth2 로그인 설정
                                .oauth2Login(oauth2 -> oauth2
                                                .loginPage("/login")
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2SuccessHandler)
                                                .failureHandler(oAuth2FailureHandler))
                                // 로그아웃 설정
                                .logout(logout -> logout
                                                .logoutUrl("/logout")
                                                .logoutSuccessUrl("/")
                                                .invalidateHttpSession(true)
                                                .deleteCookies("JSESSIONID"))
                                // CSRF 설정 (H2 Console, API 경로 허용)
                                .csrf(csrf -> csrf
                                                .ignoringRequestMatchers("/h2-console/**", "/api/**"))
                                // H2 Console 프레임 허용
                                .headers(headers -> headers
                                                .frameOptions(frame -> frame.sameOrigin()));

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
