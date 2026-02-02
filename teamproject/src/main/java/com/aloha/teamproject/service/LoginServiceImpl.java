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

		Auth.TokenResponse authTokenResponse = new Auth.TokenResponse();
		authTokenResponse.setAccessToken(newAccessToken);
		authTokenResponse.setRefreshToken(newRefreshToken);
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
