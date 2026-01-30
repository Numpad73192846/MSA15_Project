package com.aloha.teamproject.service;

<<<<<<< HEAD
import com.aloha.teamproject.dto.Users;

import jakarta.servlet.http.HttpServletRequest;

public interface LoginService {
	
	public Users login(Users user, HttpServletRequest request) throws Exception;

=======
import com.aloha.teamproject.dto.AuthTokenResponse;
import com.aloha.teamproject.dto.Users;

public interface LoginService {
	
	public AuthTokenResponse login(Users user) throws Exception;

	public AuthTokenResponse tokenRefresh(String refreshToken)  throws Exception;

	public void logout(String refreshToken)  throws Exception;
	
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
}
