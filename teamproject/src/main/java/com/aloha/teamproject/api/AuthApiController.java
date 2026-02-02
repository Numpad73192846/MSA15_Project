package com.aloha.teamproject.api;

import java.util.List;

import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.common.exception.AppException;
import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.AuthDto;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.LoginService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthApiController {
	
	private final LoginService loginService;

	@PostMapping("/login")
	public ApiResponse<AuthDto.TokenResponse> login(@RequestBody Users user, HttpServletRequest httpRequest, HttpServletResponse response) {
		
		AuthDto.TokenResponse result;

		try {
			result = loginService.login(user);
		} catch (AppException e) {
			log.error("로그인 실패: {}", e.getMessage());
			return ApiResponse.error(e.getErrorCode().getMessage());
		} catch (Exception e) {
			log.error("로그인 중 오류가 발생했습니다.", e);
			return ApiResponse.error("로그인에 실패했습니다.");
		}
		
		setTokenCookies(response, result.getAccessToken(), result.getRefreshToken());
		setSessionAuthentication(httpRequest, result);
		return ApiResponse.ok(result, SuccessCode.OK);

	}

	@PostMapping("/refresh")
	public ApiResponse<AuthDto.TokenResponse> tokenRefresh(@RequestBody(required = false) AuthDto.RefreshTokenRequest request,
			HttpServletRequest httpRequest,
			HttpServletResponse response) {

		AuthDto.TokenResponse result;

		try {
			String refreshToken = (request != null) ? request.getRefreshToken() : null;
			if (refreshToken == null || refreshToken.isBlank()) {
				refreshToken = getCookieValue(httpRequest, "refreshToken");
			}
			result = loginService.tokenRefresh(refreshToken);
			setTokenCookies(response, result.getAccessToken(), result.getRefreshToken());
			return ApiResponse.ok(result, SuccessCode.OK);
		} catch (AppException e) {
			log.error("토큰 갱신 실패: {}", e.getMessage());
			return ApiResponse.error(e.getErrorCode().getMessage());
		} catch (Exception e) {
			log.error("토큰 갱신 중 오류가 발생했습니다.", e);
			return ApiResponse.error("토큰 갱신에 실패했습니다.");
		}
		
	}

	@PostMapping("/logout")
	public ApiResponse<Void> logout(@RequestBody(required = false) AuthDto.RefreshTokenRequest request,
			HttpServletRequest httpRequest,
			HttpServletResponse response) {

		try {
			String refreshToken = (request != null) ? request.getRefreshToken() : null;
			if (refreshToken == null || refreshToken.isBlank()) {
				refreshToken = getCookieValue(httpRequest, "refreshToken");
			}
			loginService.logout(refreshToken);
			clearTokenCookies(response);
			clearSessionAuthentication(httpRequest);
			return ApiResponse.ok(SuccessCode.LOGOUT_SUCCESS);
		} catch (AppException e) {
			log.error("로그아웃 실패: {}", e.getMessage());
			return ApiResponse.error(e.getErrorCode().getMessage());
		} catch (Exception e) {
			log.error("로그아웃 중 오류가 발생했습니다.", e);
			return ApiResponse.error("로그아웃에 실패했습니다.");
		}
		

	}

	private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
		ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
				.httpOnly(true)
				.path("/")
				.sameSite("Lax")
				.build();
		ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.path("/")
				.sameSite("Lax")
				.build();
		response.addHeader("Set-Cookie", accessCookie.toString());
		response.addHeader("Set-Cookie", refreshCookie.toString());
	}

	private void clearTokenCookies(HttpServletResponse response) {
		ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
				.httpOnly(true)
				.path("/")
				.sameSite("Lax")
				.maxAge(0)
				.build();
		ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.path("/")
				.sameSite("Lax")
				.maxAge(0)
				.build();
		response.addHeader("Set-Cookie", accessCookie.toString());
		response.addHeader("Set-Cookie", refreshCookie.toString());
	}

	private String getCookieValue(HttpServletRequest request, String name) {
		if (request.getCookies() == null) {
			return null;
		}
		return java.util.Arrays.stream(request.getCookies())
				.filter(cookie -> name.equals(cookie.getName()))
				.map(cookie -> cookie.getValue())
				.findFirst()
				.orElse(null);
	}
<<<<<<< HEAD
	
	private void setSessionAuthentication(HttpServletRequest request, AuthTokenResponse result) {
=======

	private void setSessionAuthentication(HttpServletRequest request, AuthDto.TokenResponse result) {
>>>>>>> 5a44d9fe660f3bb25aed0316e0d5f8a20547784a
		if (request == null || result == null) {
			return;
		}
		List<String> authList = (result.getAuthList() == null) ? List.of() : result.getAuthList();
		List<SimpleGrantedAuthority> authorities = authList.stream()
				.map(SimpleGrantedAuthority::new)
				.toList();
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
				result.getUserId(), null, authorities);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		request.getSession(true);
	}

	private void clearSessionAuthentication(HttpServletRequest request) {
		SecurityContextHolder.clearContext();
		if (request != null) {
			var session = request.getSession(false);
			if (session != null) {
				session.invalidate();
			}
		}
	}
	


}
