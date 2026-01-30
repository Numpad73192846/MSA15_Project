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

import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.aloha.teamproject.security.JwtAuthenticationFilter;
import com.aloha.teamproject.service.UserDetailServiceImpl;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailServiceImpl userDetailServiceImpl;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
            .requestMatchers(new AntPathRequestMatcher("/admin/**"))
            .requestMatchers(new AntPathRequestMatcher("/admin"))
            .requestMatchers(new AntPathRequestMatcher("/api/admin/**"))
            .requestMatchers(new AntPathRequestMatcher("/favicon.ico"))
            .requestMatchers(new AntPathRequestMatcher("/error"));
    }

    // 비밀번호 암호화 빈 설정
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 보안 필터 체인 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // ✅ 인가 설정
        http
            .csrf(csrf -> csrf.ignoringRequestMatchers(
            "/api/auth/**",
            "/api/users/**",
            "/api/admin/**"
            ))
            .authorizeHttpRequests(auth -> auth
                // ============================== 수정 (명시적 AntPathRequestMatcher 사용) ==============================
                .requestMatchers(new AntPathRequestMatcher("/admin/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/admin")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/admin/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/admin")).permitAll()
                .requestMatchers("/login", "/join", "/auth/**", "/api/auth/**").permitAll()
                .requestMatchers("/tutor/register", "/tutor/register1", "/tutor/register2", "/tutor/register3").permitAll()
                .requestMatchers("/tutor/mypage", "/mypages", "/mypage", "/member/mypage").permitAll()
                .requestMatchers("/tutors", "/tutors/**", "/tutor/dashboard").permitAll()
                // ============================== 수정 종료 ==============================
                .requestMatchers("/", "/css/**", "/js/**", "/img/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users", "/api/users/validate").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/language-fields").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/check-username", "/api/users/check-nickname").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/auth", "/api/auth/**").hasAnyRole("USER", "TUTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/auth", "/api/auth/**").hasAnyRole("USER", "TUTOR", "ADMIN")
                .anyRequest().authenticated()
            );

        // 세션 비활성화
        http
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
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
