package com.aloha.teamproject.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.common.exception.AppException;
import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
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
	public ApiResponse<Users> login(@RequestBody Users user) {
		Users result;
		
		try {
			result = loginService.login(user.getUsername(), user.getPassword());
		} catch (AppException e) {
			log.error("로그인 실패: {}", e.getMessage());
			return ApiResponse.error(e.getErrorCode().getMessage());
		} catch (Exception e) {
			log.error("로그인 중 오류가 발생했습니다: {}", e.getMessage(), e);
			return ApiResponse.error("서버 오류가 발생했습니다.");
		}

		return ApiResponse.ok(result, SuccessCode.OK);

	}
	


}
