package com.aloha.teamproject.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    // 프로필 이미지 저장
    String saveProfileImage(MultipartFile file) throws IOException;

}
