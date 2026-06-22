package com.apta.portal.notification.controller;

import com.apta.portal.common.enums.NotificationType;
import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.notification.entity.Notification;
import com.apta.portal.notification.repository.NotificationRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/notifications", "/api/admin/notifications"})
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications() {
        List<Notification> list = notificationRepository.findAll();
        List<Map<String, Object>> responses = list.stream()
                .map(n -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", n.getId());
                    map.put("title", n.getTitle());
                    map.put("message", n.getMessage());
                    map.put("type", n.getType() != null ? n.getType() : "announcement");
                    map.put("createdAt", n.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String message = (String) body.get("message");
        String type = body.containsKey("type") ? (String) body.get("type") : "announcement";
        
        User user = getAuthenticatedUser();
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .notificationType(NotificationType.SYSTEM)
                .type(type)
                .isRead(false)
                .createdBy(user)
                .build();

        notification = notificationRepository.save(notification);
        log.info("Notification saved: {}", notification.getTitle());

        Map<String, Object> response = new HashMap<>();
        response.put("id", notification.getId());
        response.put("title", notification.getTitle());
        response.put("message", notification.getMessage());
        response.put("type", notification.getType());
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID " + id));
        notificationRepository.delete(notification);
        return ResponseEntity.ok().build();
    }
}
