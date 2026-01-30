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
