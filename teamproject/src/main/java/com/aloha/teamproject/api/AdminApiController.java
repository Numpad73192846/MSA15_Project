package com.aloha.teamproject.api;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.aloha.teamproject.common.response.ApiResponse;
import com.aloha.teamproject.service.AdminService;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminApiController {

    private final AdminService adminService;

    @PostMapping("/documents/approve")
    public ApiResponse<Void> approveDocument(@RequestBody Map<String, String> body, Authentication auth) {
        String id = body.get("id");
        adminService.approveDocument(id, auth.getName());
        return ApiResponse.ok();
    }

    @PostMapping("/documents/reject")
    public ApiResponse<Void> rejectDocument(@RequestBody Map<String, String> body, Authentication auth) {
        String id = body.get("id");
        String reason = body.get("reason");
        adminService.rejectDocument(id, auth.getName(), reason);
        return ApiResponse.ok();
    }

    @PostMapping("/settlements/remit")
    public ApiResponse<Void> remit(@RequestBody Map<String, String> body) {
        // In a real app, this would call a bank API. Here we just return success.
        return ApiResponse.ok();
    }
}
