package com.aloha.teamproject.service;

import com.aloha.teamproject.dto.TutorProfile;

public interface TutorProfileService {

    boolean upsertProfile(TutorProfile profile) throws Exception;

    TutorProfile selectByUserId(String userId) throws Exception;
}
