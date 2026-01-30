package com.aloha.teamproject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;

@Mapper
public interface UserMapper {
	
	// 회원 가입
	public int join(Users user) throws Exception;
	
	// 회원 수정
	public int update(Users user) throws Exception;

	// 회원 삭제
	public int delete(Long no) throws Exception;
	
	// 회원 권한 등록
	public int insertAuth(UserAuth userAuth) throws Exception;

	// 회원 권한 삭제
	public int deleteAuth(String userId, String auth) throws Exception;

}
