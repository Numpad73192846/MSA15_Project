package com.aloha.teamproject.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.teamproject.dto.RefreshToken;

@Mapper
public interface RefreshTokenMapper {
    
    public int insert(RefreshToken refreshToken);

    public RefreshToken findByUserIdAndTokenHash(String userId, String tokenHash);

    public int revoke(String userId, String tokenHash);

    public int deleteExpired();

}
