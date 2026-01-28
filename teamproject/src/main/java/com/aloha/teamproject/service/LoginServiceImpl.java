package com.aloha.teamproject.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.mapper.UserMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl extends BaseServiceImpl implements LoginService {

	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;

	@Override
	public Users login(Users user, HttpServletRequest request) throws Exception {
		requiredNotBlank(user.getUsername(), ErrorCode.INVALID_REQUEST);
		requiredNotBlank(user.getPassword(), ErrorCode.INVALID_REQUEST);

		Users existing = userMapper.selectByUsername(user.getUsername());
		requireNotNull(existing, ErrorCode.USER_NOT_FOUND);
		require(passwordEncoder.matches(user.getPassword(), existing.getPassword()), ErrorCode.INVALID_PASSWORD);

		UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
		Authentication authentication = authenticationManager.authenticate(token);
		require(authentication.isAuthenticated(), ErrorCode.UNAUTHORIZED);

		SecurityContextHolder.getContext().setAuthentication(authentication);
		HttpSession session = request.getSession(true);
		session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

		return existing;
	}
	
}
