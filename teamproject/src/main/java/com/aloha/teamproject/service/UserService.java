package com.aloha.teamproject.service;

import com.aloha.teamproject.common.service.BaseCrudService;
import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;

public interface UserService extends BaseCrudService<Users> {

	// 회원 가입
	default boolean join(Users user) throws Exception {
		return insert(user);
	}

	// 회원 권한 등록
	boolean insertAuth(UserAuth userAuth) throws Exception;

}
