package com.apta.portal.audit.controller;

import com.apta.portal.audit.entity.AuditLog;
import com.apta.portal.audit.repository.AuditLogRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    private Map<String, Object> mapToResponse(AuditLog log) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", log.getId());
        map.put("actionType", log.getActionType());
        map.put("tableName", log.getTableName());
        map.put("recordId", log.getRecordId());
        map.put("actionDetails", log.getActionDetails());
        map.put("clientIp", log.getClientIp());
        map.put("createdAt", log.getCreatedAt());

        if (log.getUser() != null) {
            map.put("userEmail", log.getUser().getEmail());
            map.put("userName", log.getUser().getName());
            map.put("userRole", log.getUser().getRole());
        } else {
            map.put("userEmail", "SYSTEM");
            map.put("userName", "System Automated");
            map.put("userRole", "SYSTEM");
        }
        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs() {
        User user = getAuthenticatedUser();
        if (user == null || user.getRole() == null || !user.getRole().toUpperCase().contains("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        List<AuditLog> logs = auditLogRepository.findAll();
        List<Map<String, Object>> response = logs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
