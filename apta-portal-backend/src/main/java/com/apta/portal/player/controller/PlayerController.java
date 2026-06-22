package com.apta.portal.player.controller;

import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.player.dto.PlayerResponse;
import com.apta.portal.player.dto.PlayerUpdateRequest;
import com.apta.portal.player.entity.Player;
import com.apta.portal.player.repository.PlayerRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import com.apta.portal.ranking.repository.RankingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class PlayerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RankingRepository rankingRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    private PlayerResponse mapToResponse(Player player) {
        User u = player.getUser();
        Integer rankVal = rankingRepository != null ? rankingRepository.findAll().stream()
                .filter(r -> r.getPlayer().getId().equals(player.getId()))
                .map(com.apta.portal.ranking.entity.Ranking::getCurrentRank)
                .findFirst()
                .orElse(null) : null;

        return PlayerResponse.builder()
                .id(player.getId())
                .userId(u.getId())
                .name(u.getFirstName() + " " + u.getLastName())
                .email(u.getEmail())
                .mobile(u.getPhoneNumber())
                .dateOfBirth(player.getDateOfBirth())
                .gender(player.getGender())
                .fatherName(player.getFatherName())
                .state(player.getState())
                .district(u.getDistrict())
                .photoUrl(player.getPhotoUrl())
                .registrationNumber(player.getRegistrationNumber())
                .tennikoitCategory(player.getTennikoitCategory())
                .status(player.getStatus())
                .rank(rankVal)
                .build();
    }

    @GetMapping("/api/players/profile")
    public ResponseEntity<PlayerResponse> getProfile() {
        User user = getAuthenticatedUser();
        Player player = playerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Player profile not found"));
        return ResponseEntity.ok(mapToResponse(player));
    }

    @GetMapping("/api/players/{id}")
    public ResponseEntity<PlayerResponse> getPlayerById(@PathVariable Long id) {
        // Try user ID first, then player ID
        Player player = playerRepository.findByUserId(id)
                .orElseGet(() -> playerRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Player not found with ID " + id)));
        return ResponseEntity.ok(mapToResponse(player));
    }

    @PutMapping("/api/players/profile")
    public ResponseEntity<PlayerResponse> updateProfile(@RequestBody PlayerUpdateRequest request) {
        User user = getAuthenticatedUser();
        Player player = playerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Player profile not found"));
        return updatePlayerData(user, player, request);
    }

    @PutMapping("/api/players/{id}")
    public ResponseEntity<PlayerResponse> updatePlayerById(@PathVariable Long id, @RequestBody PlayerUpdateRequest request) {
        Player player = playerRepository.findByUserId(id)
                .orElseGet(() -> playerRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Player not found")));
        User user = player.getUser();
        return updatePlayerData(user, player, request);
    }

    private ResponseEntity<PlayerResponse> updatePlayerData(User user, Player player, PlayerUpdateRequest request) {
        if (request.getName() != null) {
            String[] parts = request.getName().trim().split("\\s+", 2);
            user.setFirstName(parts[0]);
            user.setLastName(parts.length > 1 ? parts[1] : ".");
        }
        if (request.getMobile() != null) {
            user.setPhoneNumber(request.getMobile());
        }
        if (request.getDistrict() != null) {
            user.setDistrict(request.getDistrict());
        }
        userRepository.save(user);

        if (request.getFatherName() != null) {
            player.setFatherName(request.getFatherName());
        }
        if (request.getPhotoUrl() != null) {
            player.setPhotoUrl(request.getPhotoUrl());
        }
        if (request.getGender() != null) {
            player.setGender(request.getGender().toUpperCase());
        }
        if (request.getDateOfBirth() != null) {
            player.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }
        if (request.getTennikoitCategory() != null) {
            player.setTennikoitCategory(request.getTennikoitCategory());
        }
        playerRepository.save(player);

        return ResponseEntity.ok(mapToResponse(player));
    }

    @GetMapping("/api/players/search")
    public ResponseEntity<List<PlayerResponse>> searchPlayers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String district) {
        
        List<Player> allPlayers = playerRepository.findAll();
        
        List<PlayerResponse> responses = allPlayers.stream()
                .filter(p -> {
                    if (status != null && !status.isEmpty() && !p.getStatus().equalsIgnoreCase(status)) {
                        return false;
                    }
                    if (district != null && !district.isEmpty() && !p.getUser().getDistrict().equalsIgnoreCase(district)) {
                        return false;
                    }
                    if (search != null && !search.isEmpty()) {
                        String fullName = (p.getUser().getFirstName() + " " + p.getUser().getLastName()).toLowerCase();
                        return fullName.contains(search.toLowerCase()) || p.getUser().getEmail().toLowerCase().contains(search.toLowerCase());
                    }
                    return true;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/api/admin/players")
    public ResponseEntity<List<PlayerResponse>> getAllPlayersForAdmin() {
        List<Player> all = playerRepository.findAll();
        List<PlayerResponse> responses = all.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/api/players/{id}/approve")
    public ResponseEntity<PlayerResponse> approvePlayer(@PathVariable Long id) {
        Player player = playerRepository.findById(id)
                .orElseGet(() -> playerRepository.findByUserId(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Player not found")));
        player.setStatus("APPROVED");
        playerRepository.save(player);
        return ResponseEntity.ok(mapToResponse(player));
    }

    @PostMapping("/api/players/{id}/reject")
    public ResponseEntity<PlayerResponse> rejectPlayer(@PathVariable Long id) {
        Player player = playerRepository.findById(id)
                .orElseGet(() -> playerRepository.findByUserId(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Player not found")));
        player.setStatus("REJECTED");
        playerRepository.save(player);
        return ResponseEntity.ok(mapToResponse(player));
    }
}
