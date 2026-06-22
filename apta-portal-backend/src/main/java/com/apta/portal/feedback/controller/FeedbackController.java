package com.apta.portal.feedback.controller;

import com.apta.portal.feedback.entity.Feedback;
import com.apta.portal.feedback.repository.FeedbackRepository;
import com.apta.portal.player.entity.Player;
import com.apta.portal.player.repository.PlayerRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import com.apta.portal.exception.ResourceNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class FeedbackController {

    private static final Logger log = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @PostMapping("/api/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        log.info("Feedback Request: name={}, email={}, phone={}, subject={}, message={}, rating={}",
                feedback.getName(), feedback.getEmail(), feedback.getPhoneNumber(),
                feedback.getSubject(), feedback.getMessage(), feedback.getRating());

        // Validate basic fields
        if (feedback.getRating() == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Rating is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (feedback.getSubject() == null || feedback.getSubject().trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Subject is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (feedback.getMessage() == null || feedback.getMessage().trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Message is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Get currently logged-in user from SecurityContext (if available)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal().toString())) {
            String loggedInEmail = authentication.getName();
            log.info("Logged-in user submitting feedback: {}", loggedInEmail);

            User user = userRepository.findByEmail(loggedInEmail).orElse(null);
            if (user != null) {
                feedback.setUser(user);
                Player player = playerRepository.findByUserId(user.getId()).orElse(null);
                if (player != null) {
                    feedback.setPlayer(player);
                }
            }
        }

        if (feedback.getCreatedAt() == null) {
            feedback.setCreatedAt(LocalDateTime.now());
        }

        if (feedback.getStatus() == null || feedback.getStatus().trim().isEmpty()) {
            feedback.setStatus("NEW");
        }

        Feedback saved = feedbackRepository.save(feedback);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Feedback submitted successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/admin/feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAllByOrderByCreatedAtDesc());
    }

    @PutMapping("/api/admin/feedback/{id}/reply")
    public ResponseEntity<?> replyToFeedback(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        
        String reply = request.get("reply");
        String status = request.get("status");

        if (status != null && !status.trim().isEmpty()) {
            feedback.setStatus(status.trim().toUpperCase());
        } else {
            feedback.setStatus("RESPONDED");
        }
        
        if (reply != null) {
            feedback.setAdminReply(reply);
        }

        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/api/admin/feedback/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        if (!feedbackRepository.existsById(id)) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Feedback not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        feedbackRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Feedback deleted successfully");
        return ResponseEntity.ok(response);
    }
}
