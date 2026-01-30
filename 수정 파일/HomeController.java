package com.aloha.teamproject.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.teamproject.dto.JoinRequest;
import com.aloha.teamproject.dto.JoinRequestValidator;
import com.aloha.teamproject.dto.Users;
import com.aloha.teamproject.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController {

    private final UserService userService;
    private final JoinRequestValidator joinRequestValidator;
    private final Validator validator;

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
    public String join(Model model) {
        log.info(":::::::::: 회원 가입 화면 ::::::::::");
        model.addAttribute("joinRequest", new JoinRequest());
        return "auth/join";
    }

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
    public String joinPro(@Valid @ModelAttribute("joinRequest") JoinRequest joinRequest, BindingResult bindingResult, HttpServletRequest request) throws Exception {
        log.info(":::::::::: 회원 가입 처리 ::::::::::");
        log.info("joinRequest : " + joinRequest);          
      

         // ❌ 유효성 검사 실패
        if (bindingResult.hasErrors()) {
            return "auth/join"; // 다시 회원가입 페이지
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
            boolean loginResult = userService.login(user, request);
            if( loginResult ) 
                return "redirect:/";
            else
                return "redirect:/login";
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


    /**
     * [회원가입 / 중복확인 컨트롤러]
     *
     * - 중복확인 API를 PathVariable 방식에서
     *   Query Parameter 방식으로 변경
     *   (/check/{type}/{value} → /check?type=...&value=...)
     *
     * - 값이 비어 있어도 서버 검증(@NotBlank) 메시지를
     *   그대로 반환하기 위함
     */
    /**
     * 중복확인 API
     *
     * @param type  검사 대상 (email, nickname 등)
     * @param value 사용자 입력 값 (빈 값 허용)
     *
     * - JoinRequest 검증 로직을 그대로 재사용
     * - 검증 실패 시 메시지를 JSON으로 반환
     * - 프론트에서는 메시지를 가공하지 않고 그대로 출력
     */
    @GetMapping("/check")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> check(
            @RequestParam("type") String type,
            @RequestParam(value = "value", required = false) String value
    ) throws Exception {
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
            case "username" -> userService.selectById(safeValue) != null;
            case "nickname" -> userService.selectByNickname(safeValue) != null;
            default -> false;
        };

        result.put("ok", !exists);
        result.put("message", exists ? "중복된 값입니다." : "사용 가능한 값입니다.");
        return ResponseEntity.ok(result);
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

