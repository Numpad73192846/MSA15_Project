package com.aloha.teamproject.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController {

    private final UserService userService;

    @GetMapping("/")
    public String home() {
        return "index";
    }
    
    /**
     * 회원 가입 화면
     * 🔗 [GET] - /join
     * 📄 join.html
     * @return
     */
    @GetMapping("/join")
    public String join() {
        log.info(":::::::::: 회원 가입 화면 ::::::::::");
        return "join";
    }

    /**
     * 회원 가입 처리
     * 🔗 [POST] - /join
     * ➡   ⭕ /login
     *      ❌ /join?error
     * @param user
     * @return
     * @throws Exception
     */
    @PostMapping("/join")
    public String joinPro(Users user, HttpServletRequest request) throws Exception {
        log.info(":::::::::: 회원 가입 처리 ::::::::::");
        log.info("user : " + user);

        // 암호화 전 비밀번호
        String plainPassword = user.getPassword();
        // 회원 가입 처리
        int result = userService.join(user);

        // 회원 가입 성공 시, 바로 로그인
        if( result > 0 ) {
            // 암호화  전 비밀번호 다시 세팅
            user.setPassword(plainPassword);
            boolean loginResult = userService.login(user, request);
            if( loginResult ) 
                return "redirect:/";
            else
                return "redirect:/login";
        }
        return "redirect/join?error";
        
    }


    /**
     * 아이디 중복 검사
     * @param username
     * @return
     * @throws Exception
     */
    @ResponseBody
    @GetMapping("/check/{username}")
    public ResponseEntity<Boolean> userCheck(@PathVariable("username") String username) throws Exception {
        log.info("아이디 중복 확인 : " + username);
        Users user = userService.select(username);
        // 아이디 중복
        if( user != null ) {
            log.info("중복된 아이디 입니다 - " + username);
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
        // 사용 가능한 아이디입니다.
        log.info("사용 가능한 아이디 입니다." + username);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    /**
     * 로그인 화면
     * 🔗 [Get] = /login
     * @return
     */
    @GetMapping("/login")
    public String login(
        @CookieValue(value = "remember-id", required = false) Cookie cookie,
        Model model
    ) {        
        log.info("::::::::::::::: 로그인 화면 :::::::::::::::");
        String username = "";
        boolean rememberId = false;
        if ( cookie != null ) {
            log.info("CookieName : " + cookie.getName());
            log.info("CookieValue : " + cookie.getValue());
            username = cookie.getValue();
            rememberId = true;
        }
        model.addAttribute("username", username);
        model.addAttribute("rememberId", rememberId);

        return "login";
    }   
}

