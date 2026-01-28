package com.aloha.teamproject.api;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;





@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
	
	private final UserService userService;

	@GetMapping()
	public ApiResponse<String> home() {
		return ApiResponse.ok("index", SuccessCode.OK);
	}

	@GetMapping("/me")
	public ApiResponse<Users> maPage(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			return ApiResponse.error("로그인이 필요합니다.");
		}

		try {
			Users user = userService.selectByUsername(authentication.getName());
			return ApiResponse.ok(user, SuccessCode.OK);
		} catch (Exception e) {
			log.error("/api/users/me 조회 실패", e);
			return ApiResponse.error("사용자 정보를 불러오지 못했습니다.");
		}
	}
	

	@GetMapping("/check-username")
	public ApiResponse<Boolean> checkUsername(@RequestParam("username") String username) throws Exception {
		boolean available = userService.isUsernameAvailable(username);
		return ApiResponse.ok(available, SuccessCode.OK);
	}

	@GetMapping("/check-nickname")
	public ApiResponse<Boolean> checkNickname(@RequestParam("nickname") String nickname) throws Exception {
		boolean available = userService.isNicknameAvailable(nickname);
		return ApiResponse.ok(available, SuccessCode.OK);
	}

	@GetMapping("/{id}")
	public ApiResponse<Users> selectById(@PathVariable("id") String id) throws Exception {
		log.info("[GET] - selectById");
		Users user = userService.selectById(id);
		return ApiResponse.ok(user, SuccessCode.OK);
	}

	@PostMapping()
	public ApiResponse<Void> join(@RequestBody Users user) throws Exception {
		log.info("[Post] - join");
		userService.join(user);
		return ApiResponse.ok(SuccessCode.CREATED);
	}

	@PutMapping()
	public ApiResponse<Void> update(@RequestBody Users user) throws Exception {
		log.info("[Put] - update");
		userService.update(user);
		return ApiResponse.ok(SuccessCode.UPDATED);
	}
	
	@DeleteMapping("/{no}")
	public ApiResponse<Void> delete(@PathVariable("no") Long no) throws Exception {
		log.info("[Delete] - delete");
		userService.delete(no);
		return ApiResponse.ok(SuccessCode.DELETED);
	}


}
