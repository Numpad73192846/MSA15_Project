package com.aloha.teamproject.service;

import com.aloha.teamproject.dto.Users;

public interface LoginService {
	
	public Users login(String username, String password) throws Exception;

}
