package com.aloha.teamproject.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.teamproject.dto.JoinRequest;
import com.aloha.teamproject.dto.JoinRequestValidator;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.LoginService;
import com.aloha.teamproject.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
// @RequestMapping("/auth")
public class AuthController {

    private final LoginService loginService;
    private final UserService userService;
    private final JoinRequestValidator joinRequestValidator;
    private final Validator validator;

    /**
     * 로그인 화면
     * @return
     */
    @GetMapping("/login")
    public String login(
       @RequestParam(name = "tab", required = false) String tab,
        Model model
    ) {
        log.info("tab param = {}", tab);
        model.addAttribute("joinRequest", new JoinRequest());
        model.addAttribute("activeTab", "signup".equals(tab) ? "signup" : "login");
        return "auth/login";
    }

    /**
     * 튜터 회원가입 화면
     * @return
     */
    @GetMapping("/join_form_tutor")
    public String joinFormTutor() {
        log.info("튜터 회원가입 화면 요청");
        return "auth/join_form_tutor";
    }

    /**
     * 회원 가입 화면
     * 🔗 [GET] - /join
     * 📄 join.html
     * @return
     */
    // @GetMapping("/join")
    // public String join(Model model) {
    //     log.info(":::::::::: 회원 가입 화면 ::::::::::");
    //     model.addAttribute("joinRequest", new JoinRequest());
    //     return "auth/join";
    // }

    // Validator 바인딩
    @InitBinder("joinRequest")
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(joinRequestValidator);
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
    public String joinPro(
        @Valid @ModelAttribute("joinRequest") JoinRequest joinRequest, 
        BindingResult bindingResult, 
        HttpServletRequest request,
        Model model
    ) throws Exception {
        log.info(":::::::::: 회원 가입 처리 ::::::::::");
        log.info("joinRequest : " + joinRequest);          
      

         // ❌ 유효성 검사 실패
        if (bindingResult.hasErrors()) {
            model.addAttribute("activeTab", "signup");
            return "auth/login"; 
        }

        // JoinRequest → Users 변환
        Users user = Users.builder()
                    .username(joinRequest.getUsername())
                    .password(joinRequest.getPassword())
                    .name(joinRequest.getName())
                    .nickname(joinRequest.getNickname())                   
                    .build();
        log.info("userid : " + user.getUsername()); 

        // 암호화 전 비밀번호
        String plainPassword = user.getPassword();
        // 회원 가입 처리
        boolean result = userService.join(user);        

        // 회원 가입 성공 시, 바로 로그인
        if( result ) {
            // 암호화  전 비밀번호 다시 세팅
            user.setPassword(plainPassword);
            try {
                loginService.login(user, request);
                return "redirect:/";
            } catch (Exception e) {
                log.error("자동 로그인 실패", e);
                return "redirect:/login";
            }
        }
        return "redirect:/join?error";
        
    }

    /**
     * 아이디, 닉네임 중복 검사
     * @param type
     * @param value
     * @return
     * @throws Exception
     */   

    @GetMapping("/check")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> check(
            @RequestParam("type") String type,
            @RequestParam(value = "value", required = false) String value
    ) throws Exception {
        log.info("CHECK API HIT: type={}, value={}", type, value);
        Map<String, Object> result = new HashMap<>();

        if (!("username".equals(type) || "nickname".equals(type))) {
            result.put("ok", false);
            result.put("message", "유효하지 않은 요청입니다.");
            return ResponseEntity.badRequest().body(result);
        }

        String safeValue = value == null ? "" : value;

        String field = "username".equals(type) ? "username" : "nickname";
        for (ConstraintViolation<JoinRequest> violation : validator.validateValue(JoinRequest.class, field, safeValue)) {
            result.put("ok", false);
            result.put("message", violation.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        if ("nickname".equals(type)) {
            int len = safeValue.length();
            if (len < 2 || len > 20) {
                result.put("ok", false);
                result.put("message", "닉네임은 2~20자");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }
        }

        boolean exists = switch (type) {
            case "username" -> userService.isUsernameAvailable(safeValue);
            case "nickname" -> userService.isNicknameAvailable(safeValue);
            default -> false;
        };

        result.put("ok", exists);
        result.put("message", exists ? "사용 가능한 값입니다." : "중복된 값입니다.");
        return ResponseEntity.ok(result);
    }    
    
}
