package com.aloha.teamproject.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl extends BaseServiceImpl implements LoginService {

	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public Users login(String username, String password) throws Exception {
		requiredNotBlank(username, ErrorCode.INVALID_REQUEST);
		requiredNotBlank(password, ErrorCode.INVALID_REQUEST);

		Users user = userMapper.selectByUsername(username);

		requireNotNull(user, ErrorCode.USER_NOT_FOUND);

		require(passwordEncoder.matches(password, user.getPassword()), ErrorCode.INVALID_PASSWORD);

		return user;
	}
	
}
