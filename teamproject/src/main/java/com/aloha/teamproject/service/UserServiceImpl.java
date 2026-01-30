package com.aloha.teamproject.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

<<<<<<< HEAD
=======
import com.aloha.teamproject.common.exception.AppException;
import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.common.service.BaseServiceImpl;
>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8
import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
<<<<<<< HEAD
public class UserServiceImpl implements UserService {
=======
public class UserServiceImpl extends BaseServiceImpl implements UserService {
>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8

	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public List<Users> list() throws Exception {
		List<Users> userList = userMapper.list();
		return userList;
	}

	@Override
	public Users selectById(String id) throws Exception {
<<<<<<< HEAD
		Users user = userMapper.selectById(id);
=======
		requiredNotBlank(id, ErrorCode.INVALID_REQUEST);
		Users user = userMapper.selectById(id);
		requireNotNull(user, ErrorCode.USER_NOT_FOUND);
		return user;
	}

	@Override
	public Users selectByUsername(String username) throws Exception {
		requiredNotBlank(username, ErrorCode.INVALID_REQUEST);
		Users user = userMapper.selectByUsername(username);
		requireNotNull(user, ErrorCode.USER_NOT_FOUND);
>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8
		return user;
	}

	@Override
	@Transactional
<<<<<<< HEAD
	public boolean join(Users user) throws Exception {
		String username = user.getId();
		String password = user.getPassword();

		if ( password == null || password.isEmpty() ) {
			return false;
=======
	public boolean insert(Users user) throws Exception {
		requireNotNull(user, ErrorCode.INVALID_REQUEST);
		String username = user.getUsername();
		String password = user.getPassword();

		requiredNotBlank(username, ErrorCode.INVALID_REQUEST);
		requiredNotBlank(password, ErrorCode.INVALID_REQUEST);

		Users existing = userMapper.selectByUsername(username);
		require(existing == null, ErrorCode.USERNAME_DUPLICATED);


		String role = user.getRole();
		if (role == null || role.isBlank()) {
			role = "ROLE_USER";
		}
		if ("ROLE_TUTOR".equals(role)) {
			role = "ROLE_TUTOR_PENDING";
>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8
		}

		String encodedPassword = passwordEncoder.encode(password);
		user.setPassword(encodedPassword);

		int result = userMapper.join(user);

		if ( result > 0 ) {
			UserAuth userAuth = new UserAuth();
<<<<<<< HEAD
			userAuth.setId(username);
			userAuth.setAuth("ROLE_USER");
			result = userMapper.insertAuth(userAuth);
		}

		return result > 0;
=======
			userAuth.setUserId(user.getId());
			userAuth.setAuth(role);
			result = userMapper.insertAuth(userAuth);
		}

		if (result <= 0) {
			throw new AppException(ErrorCode.INTERNAL_ERROR);
		}
		return true;
>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8
	}

	@Override
	public boolean update(Users user) throws Exception {
<<<<<<< HEAD
=======
		requireNotNull(user, ErrorCode.INVALID_REQUEST);
		requireNotNull(user.getNo(), ErrorCode.INVALID_REQUEST);
>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8
		String password = user.getPassword();
		
		if ( password != null && !password.isEmpty() ) {
			String encodedPassword = passwordEncoder.encode(password);
			user.setPassword(encodedPassword);
		}
		
		int result = userMapper.update(user);
<<<<<<< HEAD
		return result > 0;
=======
		if (result <= 0) {
			throw new AppException(ErrorCode.NOT_FOUND);
		}
		return true;
>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8
		
	}

	@Override
	public boolean insertAuth(UserAuth userAuth) throws Exception {
<<<<<<< HEAD
		int result = userMapper.insertAuth(userAuth);
		return result > 0;
	}
	
=======
		requireNotNull(userAuth, ErrorCode.INVALID_REQUEST);
		int result = userMapper.insertAuth(userAuth);
		if (result <= 0) {
			throw new AppException(ErrorCode.INTERNAL_ERROR);
		}
		return true;
	}

	@Override
	public boolean deleteAuth(String userId, String auth) throws Exception {
		requiredNotBlank(userId, ErrorCode.INVALID_REQUEST);
		requiredNotBlank(auth, ErrorCode.INVALID_REQUEST);
		userMapper.deleteAuth(userId, auth);
		return true;
	}

	@Override
	public boolean delete(Long no) throws Exception {
		requireNotNull(no, ErrorCode.INVALID_REQUEST);
		int result = userMapper.delete(no);
		if (result <= 0) {
			throw new AppException(ErrorCode.NOT_FOUND);
		}
		return true;
	}

	@Override
	public boolean isUsernameAvailable(String username) throws Exception {
		requiredNotBlank(username, ErrorCode.INVALID_REQUEST);
		Users existing = userMapper.selectByUsername(username);
		return existing == null;
	}

	@Override
	public boolean isNicknameAvailable(String nickname) throws Exception {
		requiredNotBlank(nickname, ErrorCode.INVALID_REQUEST);
		Users existing = userMapper.selectByNickname(nickname);
		return existing == null;
	}

>>>>>>> 50541e7b7c5eae10bfb683199d66648f407b06a8
}
