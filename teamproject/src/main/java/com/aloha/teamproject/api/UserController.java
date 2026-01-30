package com.aloha.teamproject.api;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.common.response.SuccessCode;
import com.aloha.teamproject.dto.JoinRequest;
import com.aloha.teamproject.dto.JoinRequestValidator;
import com.aloha.teamproject.dto.Users;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import com.aloha.teamproject.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.validation.FieldError;





@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
	
	private final UserService userService;
	private final JoinRequestValidator joinRequestValidator;

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
			Users user = userService.selectById(authentication.getName());
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
	public ApiResponse<Void> join(@Valid @RequestBody JoinRequest joinRequest, BindingResult bindingResult) throws Exception {
		log.info("[Post] - join");

		joinRequestValidator.validate(joinRequest, bindingResult);

		if (bindingResult.hasErrors()) {
			String message = bindingResult.getAllErrors().get(0).getDefaultMessage();
			return ApiResponse.error(message);
		}

		Users user = Users.builder()
							.username(joinRequest.getUsername())
							.password(joinRequest.getPassword())
							.name(joinRequest.getName())
							.nickname(joinRequest.getNickname())
							.role(joinRequest.getRole())
							.build();

		userService.join(user);
		return ApiResponse.ok(SuccessCode.CREATED);
	}

	@PostMapping("/validate")
	public ApiResponse<Map<String, String>> validate(@Valid @RequestBody JoinRequest joinRequest,
			BindingResult bindingResult,
			@RequestParam(value = "fields", required = false) String fields) {

		joinRequestValidator.validate(joinRequest, bindingResult);

		Set<String> fieldSet = null;
		if (fields != null && !fields.isBlank()) {
			fieldSet = new HashSet<>(Arrays.asList(fields.split(",")));
		}

		Map<String, String> errorMap = new HashMap<>();
		for (FieldError error : bindingResult.getFieldErrors()) {
			if (fieldSet == null || fieldSet.contains(error.getField())) {
				errorMap.put(error.getField(), error.getDefaultMessage());
			}
		}

		try {
			String username = joinRequest.getUsername();
			if ((fieldSet == null || fieldSet.contains("username"))
					&& !errorMap.containsKey("username")
					&& username != null
					&& !username.isBlank()) {
				if (!userService.isUsernameAvailable(username)) {
					errorMap.put("username", "이미 존재하는 아이디입니다.");
				}
			}

			String nickname = joinRequest.getNickname();
			if ((fieldSet == null || fieldSet.contains("nickname"))
					&& !errorMap.containsKey("nickname")
					&& nickname != null
					&& !nickname.isBlank()) {
				if (!userService.isNicknameAvailable(nickname)) {
					errorMap.put("nickname", "이미 존재하는 닉네임입니다.");
				}
			}
		} catch (Exception e) {
			log.error("/api/users/validate 중복 확인 실패", e);
		}

		return ApiResponse.ok(errorMap, SuccessCode.OK);
	}

	@PutMapping("/update")
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
