package com.aloha.teamproject.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.common.exception.AppException;
import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.AuthTokenResponse;
import com.aloha.teamproject.dto.RefreshTokenRequest;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.LoginService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthApiController {
	
	private final LoginService loginService;

	@PostMapping("/login")
	public ApiResponse<AuthTokenResponse> login(@RequestBody Users user) {
		
		AuthTokenResponse result;

		try {
			result = loginService.login(user);
		} catch (AppException e) {
			log.error("로그인 실패: {}", e.getMessage());
			return ApiResponse.error(e.getErrorCode().getMessage());
		} catch (Exception e) {
			log.error("로그인 중 오류가 발생했습니다.", e);
			return ApiResponse.error("로그인에 실패했습니다.");
		}
		
		return ApiResponse.ok(result, SuccessCode.OK);

	}

	@PostMapping("/refresh")
	public ApiResponse<AuthTokenResponse> tokenRefresh(@RequestBody RefreshTokenRequest request) {

		AuthTokenResponse result;

		try {
			result = loginService.tokenRefresh(request.getRefreshToken());
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
	public ApiResponse<Void> logout(@RequestBody RefreshTokenRequest request) {

		try {
			loginService.logout(request.getRefreshToken());
			return ApiResponse.ok(SuccessCode.LOGOUT_SUCCESS);
		} catch (AppException e) {
			log.error("로그아웃 실패: {}", e.getMessage());
			return ApiResponse.error(e.getErrorCode().getMessage());
		} catch (Exception e) {
			log.error("로그아웃 중 오류가 발생했습니다.", e);
			return ApiResponse.error("로그아웃에 실패했습니다.");
		}
		

	}
	


}
