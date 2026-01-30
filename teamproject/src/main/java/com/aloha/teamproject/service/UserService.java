package com.aloha.teamproject.service;

<<<<<<< HEAD
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

	// 회원 권한 삭제
	boolean deleteAuth(String userId, String auth) throws Exception;

	// 중복 체크
	boolean isUsernameAvailable(String username) throws Exception;
	boolean isNicknameAvailable(String nickname) throws Exception;
=======
import java.util.List;

import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;

public interface UserService {
	
	// 전체 회원 조회
	public List<Users> list() throws Exception;

	// ID로 회원 조회
	public Users selectById(String id) throws Exception;
	
	// 회원 가입
	public boolean join(Users user) throws Exception;
	
	// 회원 수정
	public boolean update(Users user) throws Exception;
	
	// 회원 권한 등록
	public boolean insertAuth(UserAuth userAuth) throws Exception;
>>>>>>> parent of de2fadc (..)

}
