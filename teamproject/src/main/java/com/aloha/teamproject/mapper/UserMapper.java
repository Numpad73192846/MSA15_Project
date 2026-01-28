package com.aloha.teamproject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;

@Mapper
public interface UserMapper {

    // 전체 회원 조회
	public List<Users> list() throws Exception;

	// 회원 조회(아이디)
	public Users selectById(String id) throws Exception;

	// 회원 조회(닉네임)
	public Users selectByNickname(String nickname) throws Exception;
	
	// 회원 가입
	public int join(Users user) throws Exception;
	
	// 회원 수정
	public int update(Users user) throws Exception;
	
	// 회원 권한 등록
	public int insertAuth(UserAuth userAuth) throws Exception;

}

