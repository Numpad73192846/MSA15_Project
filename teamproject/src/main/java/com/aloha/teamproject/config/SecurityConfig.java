package com.aloha.teamproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.aloha.teamproject.service.UserDetailServiceImpl;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailServiceImpl userDetailServiceImpl;

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
            "/pages/**",
            "/swagger-ui/**",
            "/v3/api-docs/**"
            ))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers(
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .requestMatchers(HttpMethod.POST, "/pages", "/pages/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/pages", "/pages/**").hasAnyRole("USER", "TUTOR")
                .requestMatchers(HttpMethod.DELETE, "/pages", "/pages/**").hasAnyRole("USER", "TUTOR", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/**").permitAll()
                .anyRequest().authenticated()
            );

        // 사용자 상세 서비스 설정
        http.userDetailsService(userDetailServiceImpl);

        // 로그인/로그아웃 설정
        http.formLogin(form -> form.permitAll())
            .logout(logout -> logout.permitAll());

        return http.build();

    }

    // 인증 매니저 빈 설정
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
