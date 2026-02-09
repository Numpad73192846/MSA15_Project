package com.cho.handluck.oauth2;

import com.cho.handluck.domain.User;
import com.cho.handluck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * OAuth2 사용자 서비스
 * 소셜 로그인 후 사용자 정보를 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("OAuth2 로그인 시도: {}", registrationId);

        // 소셜 로그인 제공자별 사용자 정보 추출
        OAuth2UserInfo userInfo = OAuth2UserInfo.of(registrationId, oAuth2User.getAttributes());

        // 사용자 저장 또는 업데이트
        User user = saveOrUpdate(userInfo);
        user.updateLastLogin();

        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    /**
     * 사용자 저장 또는 업데이트
     * 기존 사용자면 정보 업데이트, 신규면 저장
     */
    private User saveOrUpdate(OAuth2UserInfo userInfo) {
        User user = userRepository.findByProviderAndProviderId(
                userInfo.getProvider(),
                userInfo.getProviderId())
                .map(existingUser -> existingUser.updateOAuth2(
                        userInfo.getNickname(),
                        userInfo.getProfileImage()))
                .orElseGet(userInfo::toEntity);

        return userRepository.save(user);
    }
}
