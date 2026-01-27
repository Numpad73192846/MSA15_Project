package com.aloha.teamproject.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
@RequestMapping("/pages")
public class PagesController {
	
	private final UserService userService;

	@GetMapping()
	public ApiResponse<String> home() {
		return ApiResponse.ok("index", SuccessCode.OK);
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
