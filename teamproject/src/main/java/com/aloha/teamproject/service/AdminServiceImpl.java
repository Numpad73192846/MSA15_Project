package com.aloha.teamproject.service;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.aloha.teamproject.dto.TutorDocument;
import com.aloha.teamproject.dto.TutorSettlement;
import com.aloha.teamproject.mapper.AdminMapper;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminMapper adminMapper;

    @Override
    public List<TutorDocument> getPendingDocuments() {
        return adminMapper.selectPendingDocuments();
    }

    @Override
    public void approveDocument(String id, String adminId) {
        adminMapper.updateDocumentStatus(id, "APPROVED", adminId, null);
    }

    @Override
    public void rejectDocument(String id, String adminId, String reason) {
        adminMapper.updateDocumentStatus(id, "REJECTED", adminId, reason);
    }

    @Override
    public List<TutorSettlement> getTutorSettlements() {
        return adminMapper.selectTutorSettlements();
    }
}
