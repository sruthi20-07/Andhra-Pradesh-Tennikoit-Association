package com.apta.portal.common.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> getRootHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("application", "APTAMP");
        response.put("status", "UP");
        response.put("version", "1.0");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> getApiHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1000)) {
                response.put("database", "CONNECTED");
            } else {
                response.put("database", "DISCONNECTED");
            }
        } catch (Exception e) {
            response.put("database", "DISCONNECTED");
        }
        
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }
}
