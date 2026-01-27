package com.aloha.teamproject.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public List<Users> list() throws Exception {
		List<Users> userList = userMapper.list();
		return userList;
	}

	@Override
	public Users selectById(String id) throws Exception {
		Users user = userMapper.selectById(id);
		return user;
	}

	@Override
	@Transactional
	public boolean join(Users user) throws Exception {
		String username = user.getId();
		String password = user.getPassword();

		if ( password == null || password.isEmpty() ) {
			return false;
		}

		String encodedPassword = passwordEncoder.encode(password);
		user.setPassword(encodedPassword);

		int result = userMapper.join(user);

		if ( result > 0 ) {
			UserAuth userAuth = new UserAuth();
			userAuth.setId(username);
			userAuth.setAuth("ROLE_USER");
			result = userMapper.insertAuth(userAuth);
		}

		return result > 0;
	}

	@Override
	public boolean update(Users user) throws Exception {
		String password = user.getPassword();
		
		if ( password != null && !password.isEmpty() ) {
			String encodedPassword = passwordEncoder.encode(password);
			user.setPassword(encodedPassword);
		}
		
		int result = userMapper.update(user);
		return result > 0;
		
	}

	@Override
	public boolean insertAuth(UserAuth userAuth) throws Exception {
		int result = userMapper.insertAuth(userAuth);
		return result > 0;
	}
	
}
