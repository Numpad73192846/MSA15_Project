package com.aloha.teamproject.service;

import java.util.List;

import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {

	// 로그인
    public Boolean login(Users user, HttpServletRequest request) throws Exception;
	
	// 전체 회원 조회
	public List<Users> list() throws Exception;

	// ID로 회원 조회
	public Users selectById(String id) throws Exception;

	// 이메일로 회원 조회
	public Users selectByUsername(String username) throws Exception;

	// NICKNAME으로 회원 조회
	public Users selectByNickname(String nickname) throws Exception;
	
	// 회원 가입
	public boolean join(Users user) throws Exception;
	
	// 회원 수정
	public boolean update(Users user) throws Exception;
	
	// 회원 권한 등록
	public boolean insertAuth(UserAuth userAuth) throws Exception;

}
