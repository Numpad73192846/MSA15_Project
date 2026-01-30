package com.aloha.teamproject.dto;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class JoinRequestValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return JoinRequest.class.isAssignableFrom(clazz);
    }

    // 검증 로직 구현
    @Override
    public void validate(Object target, Errors errors) {
        JoinRequest req = (JoinRequest) target; 
        
        // 닉네임: 공백 먼저, 그 다음 길이 검사
        if (!errors.hasFieldErrors("nickname")) {
            String nickname = req.getNickname();
            if (nickname != null) {
                int len = nickname.length();
                if (len < 2 || len > 20) {
                    errors.rejectValue(
                        "nickname",
                        "nickname.size",
<<<<<<< HEAD
                        "닉네임은 2~20자"
=======
                        "닉네임은 2~20자 이내여야 합니다"
>>>>>>> 9fa74627305cdc52d340b47f0b0fbd2f8da2fac1
                    );
                }
            }
        }

        // 이미 password / passwordCheck 자체 에러가 있으면 비교 안 함
        if (errors.hasFieldErrors("password") ||
            errors.hasFieldErrors("passwordCheck")) {
            return;
        }

        if (!req.getPassword().equals(req.getPasswordCheck())) {
            errors.rejectValue(
                "passwordCheck",
                "password.mismatch",
                "비밀번호가 일치하지 않습니다"
            );
        }
    }
    
}
