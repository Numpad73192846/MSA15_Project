package com.aloha.teamproject.service;

import com.aloha.teamproject.dto.AuthDto;
import com.aloha.teamproject.dto.Users;

public interface LoginService {
	
	public AuthDto.TokenResponse login(Users user) throws Exception;

	public AuthDto.TokenResponse tokenRefresh(String refreshToken)  throws Exception;

	public void logout(String refreshToken)  throws Exception;
	
}
