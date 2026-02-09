package com.aloha.teamproject.service.auth;

import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.teamproject.mapper.UserMapper;
import com.aloha.teamproject.model.CustomOAuth2User;
import com.aloha.teamproject.dto.Users;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserMapper userMapper;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info(":::::::::: OAuth2 로그인 요청 ::::::::::");
        log.info("ClientRegistration: {}", userRequest.getClientRegistration());
        log.info("AccessToken: {}", userRequest.getAccessToken().getTokenValue());

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                                                  .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 소셜 로그인 정보 추출
        String email = extractEmail(registrationId, attributes);
        String name = extractName(registrationId, attributes);
        
        Users user = null;
        try {
            user = userMapper.selectByUsername(email);
        } catch (Exception e) {
            log.error("사용자 조회 실패", e);
        }

        if (user == null) {
            try {
                user = createUser(email, name);
                log.info("[OAuth2UserService] 생성할 사용자 정보: username={}, id={}", user.getUsername(), user.getId());
                int joinResult = userMapper.join(user);
                log.info("[OAuth2UserService] userMapper.join 결과: {}", joinResult);
                user = userMapper.selectByUsername(email);
                log.info("[OAuth2UserService] 회원 생성 후 조회 결과: {}", user != null ? user.getId() : null);
            } catch (Exception e) {
                log.error("사용자 생성 실패", e);
                throw new OAuth2AuthenticationException("사용자 생성에 실패했습니다.");
            }
        }

        log.info("로그인 성공 또는 신규 사용자 생성 완료: {}", user.getUsername());

        String resolvedRole = resolveRole(user);

        return new CustomOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(resolvedRole)),
                attributes,
                userNameAttributeName,
                user.getNo(),
                user.getId(),
                resolvedRole
        );
    }

    private String resolveRole(Users user) {
        if (user == null || user.getAuthList() == null || user.getAuthList().isEmpty()) {
            return "ROLE_GUEST";
        }
        boolean hasTutor = user.getAuthList().stream().anyMatch(auth -> "ROLE_TUTOR".equals(auth.getAuth()));
        if (hasTutor) {
            return "ROLE_TUTOR";
        }
        boolean hasUser = user.getAuthList().stream().anyMatch(auth -> "ROLE_USER".equals(auth.getAuth()));
        if (hasUser) {
            return "ROLE_USER";
        }
        String fallback = user.getAuthList().get(0).getAuth();
        return fallback != null ? fallback : "ROLE_GUEST";
    }

    private Users createUser(String email, String name) {
        Users newUser = new Users();
        newUser.setUsername(email);
        newUser.setName(name);
        newUser.setNickname(name);
        newUser.setRole("ROLE_GUEST");
        newUser.setPassword("OAUTH2_USER");
        return newUser;
    }

    private String extractEmail(String registrationId, Map<String, Object> attributes) {
        if ("google".equals(registrationId)) {
            return (String) attributes.get("email");
        } else if ("naver".equals(registrationId)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            return (String) response.get("email");
        } else if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            return (String) kakaoAccount.get("email");
        }
        return null;
    }

    private String extractName(String registrationId, Map<String, Object> attributes) {
        if ("google".equals(registrationId)) {
            return (String) attributes.get("name");
        } else if ("naver".equals(registrationId)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            return (String) response.get("name");
        } else if ("kakao".equals(registrationId)) {
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            return (String) properties.get("nickname");
        }
        return null;
    }
}
