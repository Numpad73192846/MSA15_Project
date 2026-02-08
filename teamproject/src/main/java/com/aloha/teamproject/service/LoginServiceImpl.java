package com.aloha.teamproject.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.Auth;
import com.aloha.teamproject.dto.RefreshToken;
import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.mapper.UserMapper;
import com.aloha.teamproject.util.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl extends BaseServiceImpl implements LoginService {

	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final RefreshTokenService refreshTokenService;

	@Value("${jwt.access-exp}")
	private long accessExpMs;

	@Value("${jwt.refresh-exp}")
	private long refreshExpMs;

	@Override
	public Auth.TokenResponse login(Users user) throws Exception {
		requireNotNull(user, ErrorCode.USER_NOT_FOUND);
		String username = user.getUsername();
		String password = user.getPassword();

		requiredNotBlank(username, ErrorCode.INVALID_REQUEST);
		requiredNotBlank(password, ErrorCode.INVALID_REQUEST);

		Users existing = userMapper.selectByUsername(username);
		requireNotNull(existing, ErrorCode.USER_NOT_FOUND);
		require(passwordEncoder.matches(password, existing.getPassword()), ErrorCode.INVALID_CREDENTIALS);

		List<String> authList = (existing.getAuthList() == null)
				? List.of()
				: existing.getAuthList().stream()
									 .map(UserAuth::getAuth)
									 .toList();

		String accessToken = jwtTokenProvider.createAccessToken(existing.getId(), authList);
		String refreshToken = jwtTokenProvider.createRefreshToken(existing.getId());
		String refreshTokenHash = sha256(refreshToken);

		RefreshToken refreshTokenEntity = RefreshToken.builder()
												  .userId(existing.getId())
												  .tokenHash(refreshTokenHash)
												  .expiresAt(new Date(System.currentTimeMillis() + refreshExpMs))
												  .build();
		refreshTokenService.insert(refreshTokenEntity);

		Auth.TokenResponse authTokenResponse = new Auth.TokenResponse();
		authTokenResponse.setAccessToken(accessToken);
		authTokenResponse.setRefreshToken(refreshToken);
		authTokenResponse.setExpiresIn(accessExpMs);
		authTokenResponse.setUserId(existing.getId());
		authTokenResponse.setAuthList(authList);

		return authTokenResponse;
	}

	@Override
	public Auth.TokenResponse tokenRefresh(String refreshToken) throws Exception {
		requiredNotBlank(refreshToken, ErrorCode.INVALID_REQUEST);
		require(jwtTokenProvider.validateToken(refreshToken), ErrorCode.UNAUTHORIZED);

		String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
		String refreshTokenHash = sha256(refreshToken);
		RefreshToken saved = refreshTokenService.findByUserIdAndTokenHash(userId, refreshTokenHash);

		requireNotNull(saved, ErrorCode.UNAUTHORIZED);

		refreshTokenService.revoke(userId, refreshTokenHash);

		Users existing = userMapper.selectById(userId);

		requireNotNull(existing, ErrorCode.USER_NOT_FOUND);

		List<String> authList = (existing.getAuthList() == null)
				? List.of()
				: existing.getAuthList().stream()
									 .map(UserAuth::getAuth)
									 .toList();

		String newAccessToken = jwtTokenProvider.createAccessToken(existing.getId(), authList);
		String newRefreshToken = jwtTokenProvider.createRefreshToken(existing.getId());
		String newRefreshTokenHash = sha256(newRefreshToken);

		RefreshToken refreshTokenEntity = RefreshToken.builder()
												  .userId(existing.getId())
												  .tokenHash(newRefreshTokenHash)
												  .expiresAt(new Date(System.currentTimeMillis() + refreshExpMs))
												  .build();

		refreshTokenService.insert(refreshTokenEntity);

		Auth.TokenResponse authTokenResponse = new Auth.TokenResponse();		authTokenResponse.setAccessToken(newAccessToken);		authTokenResponse.setRefreshToken(newRefreshToken);
		authTokenResponse.setExpiresIn(accessExpMs);
		authTokenResponse.setUserId(existing.getId());
		authTokenResponse.setAuthList(authList);

		return authTokenResponse;
	}

	@Override
	public void logout(String refreshToken) throws Exception {
		requiredNotBlank(refreshToken, ErrorCode.INVALID_REQUEST);
		require(jwtTokenProvider.validateToken(refreshToken), ErrorCode.UNAUTHORIZED);

		String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
		String refreshTokenHash = sha256(refreshToken);

		refreshTokenService.revoke(userId, refreshTokenHash);

	}

	@Override
	public Auth.TokenResponse socialLogin(String provider, String role) throws Exception {
		requiredNotBlank(provider, ErrorCode.INVALID_REQUEST);
		requiredNotBlank(role, ErrorCode.INVALID_REQUEST);
		
		// 소셜 로그인용 고정 계정 정보
		String username = "social@" + provider.toLowerCase() + ".com";
		String name = provider.substring(0, 1).toUpperCase() + provider.substring(1) + "사용자";
		
		// 기존 계정 조회
		Users existing = userMapper.selectByUsername(username);
		
		// 계정이 없으면 자동 생성
		if (existing == null) {
			// 닉네임 중복 체크 및 생성
			String baseNickname = name;
			String nickname = baseNickname;
			int count = 1;
			
			// 닉네임이 중복되면 뒤에 숫자 추가
			while (userMapper.selectByNickname(nickname) != null) {
				nickname = baseNickname + count;
				count++;
			}
			
			Users newUser = Users.builder()
					.id("social_" + provider.toLowerCase() + "_" + System.currentTimeMillis())
					.username(username)
					.password(passwordEncoder.encode("auto_generated_" + System.currentTimeMillis()))
					.name(name)
					.nickname(nickname)
					.status("ACTIVE")
					.build();
			
			int result = userMapper.join(newUser);
			require(result > 0, ErrorCode.INTERNAL_ERROR);
			
			// 역할에 따른 권한 추가
			UserAuth userAuth = UserAuth.builder()
					.userId(newUser.getId())
					.id(newUser.getId() + "_auth")
					.auth(role)
					.build();
			userMapper.insertAuth(userAuth);
			
			existing = userMapper.selectByUsername(username);
		}
		
		// 토큰 생성
		List<String> authList = (existing.getAuthList() == null)
				? List.of()
				: existing.getAuthList().stream()
								 .map(UserAuth::getAuth)
								 .toList();

		String accessToken = jwtTokenProvider.createAccessToken(existing.getId(), authList);
		String refreshToken = jwtTokenProvider.createRefreshToken(existing.getId());
		String refreshTokenHash = sha256(refreshToken);

		RefreshToken refreshTokenEntity = RefreshToken.builder()
										  .userId(existing.getId())
										  .tokenHash(refreshTokenHash)
										  .expiresAt(new Date(System.currentTimeMillis() + refreshExpMs))
										  .build();
		refreshTokenService.insert(refreshTokenEntity);

		Auth.TokenResponse authTokenResponse = new Auth.TokenResponse();
		authTokenResponse.setAccessToken(accessToken);
		authTokenResponse.setRefreshToken(refreshToken);
		authTokenResponse.setExpiresIn(accessExpMs);
		authTokenResponse.setUserId(existing.getId());
		authTokenResponse.setAuthList(authList);

		return authTokenResponse;
	}

	// OAuth2 설정 완료 후 활성화
	/*
	@Override
	public Auth.TokenResponse completeOAuthSignup(String tempToken, String role) throws Exception {
		requiredNotBlank(tempToken, ErrorCode.INVALID_REQUEST);
		requiredNotBlank(role, ErrorCode.INVALID_REQUEST);
		require(jwtTokenProvider.validateToken(tempToken), ErrorCode.UNAUTHORIZED);

		String username = jwtTokenProvider.getUserIdFromToken(tempToken);
		
		// 이미 가입된 사용자인지 확인
		Users existing = userMapper.selectByUsername(username);
		if (existing != null && existing.getNo() != null) {
			throw appException(ErrorCode.DUPLICATE_RESOURCE);
		}

		// 신규 사용자 생성
		Users newUser = Users.builder()
				.username(username)
				.name(username.split("@")[0])
				.nickname(username.split("@")[0])
				.password(passwordEncoder.encode("oauth2-" + System.currentTimeMillis())) // OAuth 사용자는 비밀번호 불필요
				.role(role)
				.status("ACTIVE")
				.build();

		int result = userMapper.join(newUser);
		require(result > 0, ErrorCode.INTERNAL_ERROR);

		// 권한 추가
		UserAuth userAuth = new UserAuth();
		userAuth.setUserId(newUser.getId());
		userAuth.setAuth(role);
		userMapper.insertAuth(userAuth);

		// 토큰 생성
		List<String> authList = List.of(role);
		String accessToken = jwtTokenProvider.createAccessToken(newUser.getId(), authList);
		String refreshToken = jwtTokenProvider.createRefreshToken(newUser.getId());
		String refreshTokenHash = sha256(refreshToken);

		RefreshToken refreshTokenEntity = RefreshToken.builder()
				.userId(newUser.getId())
				.tokenHash(refreshTokenHash)
				.expiresAt(new Date(System.currentTimeMillis() + refreshExpMs))
				.build();
		refreshTokenService.insert(refreshTokenEntity);

		Auth.TokenResponse authTokenResponse = new Auth.TokenResponse();
		authTokenResponse.setAccessToken(accessToken);
		authTokenResponse.setRefreshToken(refreshToken);
		authTokenResponse.setExpiresIn(accessExpMs);
		authTokenResponse.setUserId(newUser.getId());
		authTokenResponse.setAuthList(authList);

		return authTokenResponse;
	}
	*/

	private String sha256(String value) throws Exception {
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		byte[] digest = md.digest(value.getBytes(StandardCharsets.UTF_8));
		StringBuilder sb = new StringBuilder();
		for (byte b : digest) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
	}
	
}
