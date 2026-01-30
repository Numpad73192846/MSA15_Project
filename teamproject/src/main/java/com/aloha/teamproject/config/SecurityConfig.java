package com.aloha.teamproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AndRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;

import com.aloha.teamproject.security.JwtAuthenticationFilter;
import com.aloha.teamproject.service.UserDetailServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailServiceImpl userDetailServiceImpl;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain authApiChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/auth/**")
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain apiChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher(new AndRequestMatcher(
                new AntPathRequestMatcher("/api/**"),
                new NegatedRequestMatcher(new AntPathRequestMatcher("/api/auth/**"))
            ))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/users", "/api/users/validate").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/language-fields").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/check-username", "/api/users/check-nickname").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/auth", "/api/auth/**").hasAnyRole("USER", "TUTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/auth", "/api/auth/**").hasAnyRole("USER", "TUTOR", "ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .userDetailsService(userDetailServiceImpl);

        return http.build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain webChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher(new NegatedRequestMatcher(new AntPathRequestMatcher("/api/**")))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/join", "/auth/**", "/tutor/register", "/tutor/mypage", "/mypages", "/mypage", "/member/mypage", "/tutors", "/tutors/**", "/tutor/dashboard").permitAll()
                .requestMatchers("/", "/css/**", "/js/**", "/img/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .userDetailsService(userDetailServiceImpl);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
