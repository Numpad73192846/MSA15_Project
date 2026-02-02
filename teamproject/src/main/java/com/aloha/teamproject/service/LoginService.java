package com.aloha.teamproject.service;

import com.aloha.teamproject.dto.Auth;
import com.aloha.teamproject.dto.Users;

public interface LoginService {
	
	public Auth.TokenResponse login(Users user) throws Exception;

	public Auth.TokenResponse tokenRefresh(String refreshToken)  throws Exception;

	public void logout(String refreshToken)  throws Exception;
	
}
