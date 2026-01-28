package com.aloha.teamproject.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JoinRequest {
    @Email(message = "이메일 형식이 아닙니다")
    @NotBlank(message = "이메일은 필수입니다")
    private String username;
    private boolean usernameChecked;   // 이메일 중복검사 통과 여부 

    @Pattern(
        regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).{6,}$",
        message = "비밀번호는 6자 이상이며 특수문자를 1개 이상 포함해야 합니다."
    )
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수입니다")
    private String passwordCheck;

    @NotBlank(message = "닉네임은 필수입니다")
    @Size(min = 2, max = 20, message = "닉네임은 2~20자")
    private String nickname;
    private boolean nicknameChecked;   // 닉네임 중복검사 통과 여부
    
    @NotBlank(message = "이름은 필수입니다")
    private String name;

}
