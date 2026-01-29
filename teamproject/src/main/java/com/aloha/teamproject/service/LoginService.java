package com.aloha.teamproject.service;

import com.aloha.teamproject.dto.Users;

import jakarta.servlet.http.HttpServletRequest;

public interface LoginService {
	
	public Users login(Users user, HttpServletRequest request) throws Exception;

}
