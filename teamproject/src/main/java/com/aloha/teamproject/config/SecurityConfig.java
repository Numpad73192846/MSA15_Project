<<<<<<< HEAD
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

import com.aloha.teamproject.security.JwtAuthenticationFilter;
import com.aloha.teamproject.service.UserDetailServiceImpl;

import lombok.RequiredArgsConstructor;

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

    // 1) /api/auth/** : 인증 관련 API (로그인/리프레시 등)
    @Bean
    @Order(1)
    public SecurityFilterChain authApiChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/auth/**")
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            // REST면 보통 STATELESS 권장 (세션 불필요)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    // 2) /api/** : 나머지 API는 JWT 필수
    @Bean
    @Order(2)
    public SecurityFilterChain apiChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/**")
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 안전장치: /api/auth/**는 위 체인에서 처리되지만, 여기서도 열어줘도 OK
                .requestMatchers("/api/auth/**").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/users", "/api/users/validate").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/language-fields").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/check-username", "/api/users/check-nickname").permitAll()

                .requestMatchers(HttpMethod.PUT, "/api/auth", "/api/auth/**").hasAnyRole("USER", "TUTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/auth", "/api/auth/**").hasAnyRole("USER", "TUTOR", "ADMIN")

                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .userDetailsService(userDetailServiceImpl);

        return http.build();
    }

    // 3) 그 외(SSR/정적) : 테스트 UI 용도면 permitAll 위주
    @Bean
    @Order(3)
    public SecurityFilterChain webChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/join").permitAll()
                .requestMatchers("/css/**", "/js/**", "/img/**").permitAll()

                // SSR 페이지들(테스트용이면 일단 열어두기)
                .requestMatchers(
                    "/tutor/register",
                    "/tutor/mypage",   // ✅ 튜터 마이페이지 URL
                    "/mypages",        // (기존 호환)
                    "/mypage",
                    "/member/mypage",
                    "/tutors", "/tutors/**",
                    "/tutor/dashboard"
                ).permitAll()

                .anyRequest().permitAll() // ← SSR을 테스트 UI로만 쓸 거면 이렇게도 OK
                // .anyRequest().authenticated() // ← SSR도 인증 걸고 싶으면 이걸로
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
=======
package com.aloha.teamproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        /// ✅ 인가 설정
        http
        .csrf(csrf -> csrf.ignoringRequestMatchers(
          "/pages/**",
          "/swagger-ui/**",
          "/v3/api-docs/**"
        ))
        .authorizeHttpRequests(auth -> 
            auth.requestMatchers("/**",
                                            "/swagger-ui/**",
                                            "/v3/api-docs/**",
                                            "/swagger-ui.html"
            ).permitAll()
            .requestMatchers("/pages/**").permitAll()
            .anyRequest().permitAll()
        );

        return http.build();

    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}
>>>>>>> parent of de2fadc (..)
