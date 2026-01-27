package com.aloha.teamproject.service;

import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {
	
    // 로그인
    public Boolean login(Users user, HttpServletRequest request) throws Exception;

    // 조회
    public Users select(String username) throws Exception;

    // 회원 가입
    public int join(Users user)  throws Exception;

    // 회원 수정
    public int update(Users user) throws Exception;

    // 회원 권한 등록
    public int insertAuth(UserAuth userAuth) throws Exception;

}
