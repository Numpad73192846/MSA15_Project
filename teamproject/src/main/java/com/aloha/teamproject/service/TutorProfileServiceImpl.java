package com.aloha.teamproject.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.teamproject.common.exception.AppException;
import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.mapper.TutorProfileMapper;
import com.aloha.teamproject.util.YoutubeUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TutorProfileServiceImpl extends BaseServiceImpl implements TutorProfileService {

    private final TutorProfileMapper tutorProfileMapper;
    private final YoutubeUtil youtubeUtil;

    private static final String UPLOAD_DIR = "uploads/tutors/";

    @Override
    public boolean upsertProfile(TutorProfile profile) throws Exception {
        requireNotNull(profile, ErrorCode.INVALID_REQUEST);
        requiredNotBlank(profile.getUserId(), ErrorCode.INVALID_REQUEST);

        // ⭐ 유튜브 URL 변환
        if (profile.getVideoUrl() != null && !profile.getVideoUrl().isBlank()) {
            try {
                profile.setVideoUrl(
                    youtubeUtil.toEmbedUrl(profile.getVideoUrl())
                );
            } catch (IllegalArgumentException e) {
                log.warn("Invalid YouTube URL: {}", profile.getVideoUrl());
                profile.setVideoUrl(null);
            }
        } else {
            profile.setVideoUrl(null);
        }

        int result = tutorProfileMapper.upsertProfile(profile);
        if (result <= 0) {
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
        return true;
    }

    @Override
    public TutorProfile selectByUserId(String userId) throws Exception {
        requiredNotBlank(userId, ErrorCode.INVALID_REQUEST);
        return tutorProfileMapper.selectByUserId(userId);
    }    

    @Override
    public String saveProfileImg(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        String originalName = file.getOriginalFilename();
        String ext = FilenameUtils.getExtension(originalName);
        String fileName = UUID.randomUUID() + "." + ext;
        
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        
        log.debug("프로필 이미지 저장 완료: {}", path);

        return "/uploads/tutors/" + fileName;
    }

}
