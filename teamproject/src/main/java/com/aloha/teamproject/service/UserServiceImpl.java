package com.aloha.teamproject.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.teamproject.dto.UserAuth;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.mapper.UserMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public Boolean login(Users user, HttpServletRequest request) throws Exception {
        // 💍 토큰 생성
        String username = user.getUsername();    // 아이디
        String password = user.getPassword();    // 암호화되지 않은 비밀번호
        UsernamePasswordAuthenticationToken token 
            = new UsernamePasswordAuthenticationToken(username, password);
        
        // 토큰을 이용하여 인증
        Authentication authentication = authenticationManager.authenticate(token);
        
        // 인증 여부 확인
        boolean result = authentication.isAuthenticated();

        // 인증이 성공하면 SecurityContext에 설정
        if (result) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 세션에 인증 정보 설정 (세션이 없으면 새로 생성)
            HttpSession session = request.getSession(true);  // 세션이 없으면 새로 생성
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        }

        return result;
    }

    @Override
	public List<Users> list() throws Exception {
		List<Users> userList = userMapper.list();
		return userList;
	}

	@Override
	public Users selectById(String id) throws Exception {
		Users user = userMapper.selectById(id);
		return user;
	}

    @Override
	public Users selectByUsername(String username) throws Exception {
		Users user = userMapper.selectByUsername(username);
		return user;
	}


    @Override
	public Users selectByNickname(String nickname) throws Exception {
		Users user = userMapper.selectByNickname(nickname);
		return user;
	}

    @Override
    @Transactional
    public boolean join(Users user) throws Exception {
        String username = user.getUsername();
        String password = user.getPassword();
        
        if ( password == null || password.isEmpty() ) {
            return false;
		}

        String encodedPassword = passwordEncoder.encode(password);  // 🔒 비밀번호 암호화
        user.setPassword(encodedPassword);

        // 회원 등록
        int result = userMapper.join(user);

        if( result > 0 ) {
            // 회원 기본 권한 등록
            UserAuth userAuth = new UserAuth();
            userAuth.setUserId(user.getId());
            userAuth.setAuth("ROLE_USER");
            result = userMapper.insertAuth(userAuth);
        }
        return result > 0;
    }   

    @Override
    public boolean update(Users user) throws Exception {
        // 비밀번호 변경하는 경우 암호화 처리
        String password = user.getPassword();
        if( password != null && !password.isEmpty() ) {
          String encodedPassword = passwordEncoder.encode(password);  // 🔒 비밀번호 암호화
          user.setPassword(encodedPassword);
        }
        int result = userMapper.update(user);
        return result > 0;
    }

    @Override
    public boolean insertAuth(UserAuth userAuth) throws Exception {
        int result = userMapper.insertAuth(userAuth);
        return result > 0;
    }
	
}
