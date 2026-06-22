package com.apta.portal.grievance.controller;

import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.grievance.entity.Grievance;
import com.apta.portal.grievance.repository.GrievanceRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    private Map<String, Object> mapToResponse(Grievance grievance) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", grievance.getId());
        map.put("subject", grievance.getSubject());
        map.put("description", grievance.getDescription());
        map.put("status", grievance.getStatus());
        map.put("createdAt", grievance.getCreatedAt());
        
        if (grievance.getUser() != null) {
            map.put("userId", grievance.getUser().getId());
            map.put("name", grievance.getUser().getName());
            map.put("email", grievance.getUser().getEmail());
        } else {
            map.put("name", grievance.getName());
            map.put("email", grievance.getEmail());
        }
        
        map.put("resolutionDetails", grievance.getResolutionDetails());
        map.put("resolvedAt", grievance.getResolvedAt());
        if (grievance.getResolvedBy() != null) {
            map.put("resolvedByName", grievance.getResolvedBy().getName());
        }
        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getGrievances() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<Grievance> grievances;
        if (user.getRole() != null && user.getRole().toUpperCase().contains("ADMIN")) {
            grievances = grievanceRepository.findAll();
        } else {
            grievances = grievanceRepository.findByUser(user);
        }

        List<Map<String, Object>> responses = grievances.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createGrievance(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        String subject = (String) body.get("subject");
        String description = (String) body.get("description");

        Grievance grievance = Grievance.builder()
                .user(user)
                .subject(subject)
                .description(description)
                .status("OPEN")
                .build();

        grievance = grievanceRepository.save(grievance);
        return ResponseEntity.ok(mapToResponse(grievance));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Map<String, Object>> resolveGrievance(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        if (user == null || user.getRole() == null || !user.getRole().toUpperCase().contains("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found"));

        String details = (String) body.get("resolutionDetails");
        grievance.setResolutionDetails(details);
        grievance.setResolvedBy(user);
        grievance.setResolvedAt(ZonedDateTime.now());
        grievance.setStatus("RESOLVED");

        grievance = grievanceRepository.save(grievance);
        return ResponseEntity.ok(mapToResponse(grievance));
    }
}
