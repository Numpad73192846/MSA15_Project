package com.aloha.teamproject.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/pages")
public class PagesController {

	private final UserService userService;

	@GetMapping()
	public ResponseEntity<?> home() {
		return new ResponseEntity<>("index", HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> selectById() {
		log.info("[GET] - selectById");
		try {
			List<Users> userList = userService.list();
			return new ResponseEntity<>(userList, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping()
	public ResponseEntity<?> join(@RequestBody Users user) {
		log.info("[Post] - join");
		try {
			boolean result = userService.join(user);
			if (!result) {
				return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
			}
			return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("EXCEPTION", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
