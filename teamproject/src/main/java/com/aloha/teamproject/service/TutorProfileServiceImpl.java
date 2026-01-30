package com.aloha.teamproject.service;

import org.springframework.stereotype.Service;

import com.aloha.teamproject.common.exception.AppException;
import com.aloha.teamproject.common.exception.ErrorCode;
import com.aloha.teamproject.common.service.BaseServiceImpl;
import com.aloha.teamproject.dto.TutorProfile;
import com.aloha.teamproject.mapper.TutorProfileMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TutorProfileServiceImpl extends BaseServiceImpl implements TutorProfileService {

    private final TutorProfileMapper tutorProfileMapper;

    @Override
    public boolean upsertProfile(TutorProfile profile) throws Exception {
        requireNotNull(profile, ErrorCode.INVALID_REQUEST);
        requiredNotBlank(profile.getUserId(), ErrorCode.INVALID_REQUEST);

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
}
