package com.aloha.teamproject.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.aloha.teamproject.common.exception.AppException;
import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.dto.CustomUser;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

<<<<<<< HEAD
/**
 * UserDetailsService : 사용자 정보 불러오는 인터페이스
 * 사용자 정보를 로드하는 방법을 정의
 */
=======
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {
<<<<<<< HEAD
    
=======

>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user;
        try {
            user = userMapper.selectByUsername(username);
        } catch (Exception e) {
            log.error("사용자의 이름을 불러오는데 실패했습니다: {}", username, e);
            throw new AppException(ErrorCode.USER_LOOKUP_FAILED);
        }
<<<<<<< HEAD

        if( user == null ) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다." + username);
        }

        return new CustomUser(user);
    }

=======
        
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.: " + username);
        }
        
        return new CustomUser(user);
    }
    
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
}
