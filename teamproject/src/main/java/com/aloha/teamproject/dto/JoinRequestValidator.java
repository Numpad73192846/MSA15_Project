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

    @Override
    public void validate(Object target, Errors errors) {
        JoinRequest req = (JoinRequest) target;        

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
