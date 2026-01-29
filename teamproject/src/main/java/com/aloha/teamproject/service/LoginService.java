package com.aloha.teamproject.service;

import com.aloha.teamproject.dto.AuthTokenResponse;
import com.aloha.teamproject.dto.Users;

public interface LoginService {
	
	public AuthTokenResponse login(Users user) throws Exception;

	public AuthTokenResponse tokenRefresh(String refreshToken)  throws Exception;

	public void logout(String refreshToken)  throws Exception;
	
}
