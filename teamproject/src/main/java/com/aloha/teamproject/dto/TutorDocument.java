package com.aloha.teamproject.dto;

import java.util.Date;
import lombok.Data;

@Data
public class TutorDocument {
    private Long no;
    private String userId;
    private String id;
    private String docType; // 'EDUCATION', 'DEGREE', 'CERTIFICATE'
    private int fileSize;
    private String reviewedBy;
    private Date reviewedAt;
    private String rejectReason;
    private String originalName;
    private String storeName;
    private String filePath;
    private String contentType;
    private Date createdAt;
    private Date updatedAt;
    
    // For joining with users
    private String userName;
}
