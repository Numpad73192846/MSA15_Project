package com.aloha.teamproject.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;





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
	public ResponseEntity<?> selectById(@PathVariable("id") String id) {
		log.info("[GET] - selectById");
		try {
			Users user = userService.selectById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
		} catch (Exception e) {
			log.error("selectById failed", e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping()
	public ResponseEntity<?> join(@RequestBody Users user) {
		log.info("[Post] - join");
		try {
			boolean result = userService.join(user);
			if ( !result ) {
				return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
			}
			return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
		} catch (Exception e) {
			log.error("join failed", e);
			return new ResponseEntity<>("EXCEPTION",HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping()
	public ResponseEntity<?> update(@RequestBody Users user) {
		log.info("[Put] - update");
		try {
			boolean result = userService.update(user);
			if ( !result ) {
				return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
			}
			return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
		} catch (Exception e) {
			log.error("update failed", e);
			return new ResponseEntity<>("EXCEPTION",HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/{no}")
	public ResponseEntity<?> delete(@PathVariable("no") Long no) {
		log.info("[Delete] - delete");
		try {
			boolean result = userService.delete(no);
			if ( !result ) {
				return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
			}
			return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
		} catch (Exception e) {
			log.error("update failed", e);
			return new ResponseEntity<>("EXCEPTION",HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


}
