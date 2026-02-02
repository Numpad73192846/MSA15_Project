package com.aloha.teamproject.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.teamproject.common.service.BaseServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl extends BaseServiceImpl implements FileService {
    
    private static final String UPLOAD_DIR = "uploads/tutors/";

    @Override
    public String saveProfileImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        String originalName = file.getOriginalFilename();
        String ext = FilenameUtils.getExtension(originalName);
        String fileName = UUID.randomUUID() + "." + ext;
        
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        
        if (ext == null || ext.isEmpty()) {
            throw new IllegalArgumentException("확장자가 없는 파일입니다.");
        }
        
        log.debug("프로필 이미지 저장 완료: {}", path);

        return "/uploads/tutors/" + fileName;
    }
    
}
