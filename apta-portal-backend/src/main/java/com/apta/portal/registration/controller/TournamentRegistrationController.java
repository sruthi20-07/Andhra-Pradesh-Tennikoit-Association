package com.apta.portal.registration.controller;

import com.apta.portal.common.enums.RegistrationStatus;
import com.apta.portal.exception.BusinessException;
import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.player.entity.Player;
import com.apta.portal.player.repository.PlayerRepository;
import com.apta.portal.registration.entity.TournamentRegistration;
import com.apta.portal.registration.repository.TournamentRegistrationRepository;
import com.apta.portal.tournament.entity.Tournament;
import com.apta.portal.tournament.entity.TournamentCategory;
import com.apta.portal.tournament.repository.TournamentCategoryRepository;
import com.apta.portal.tournament.repository.TournamentRepository;
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
@RequestMapping("/api/registrations")
public class TournamentRegistrationController {

    @Autowired
    private TournamentRegistrationRepository registrationRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TournamentCategoryRepository categoryRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    private Map<String, Object> mapToResponse(TournamentRegistration reg) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", reg.getId());
        map.put("registrationDate", reg.getRegistrationDate());
        map.put("status", reg.getStatus());
        map.put("registrationStatus", reg.getStatus());
        map.put("paymentStatus", reg.getPaymentStatus());

        Map<String, Object> tMap = new HashMap<>();
        tMap.put("id", reg.getTournament().getId());
        tMap.put("title", reg.getTournament().getTitle());
        tMap.put("venue", reg.getTournament().getVenue());
        tMap.put("startDate", reg.getTournament().getStartDate());
        tMap.put("entryFee", reg.getTournament().getEntryFee());
        map.put("tournament", tMap);

        Map<String, Object> cMap = new HashMap<>();
        cMap.put("id", reg.getCategory().getId());
        cMap.put("categoryName", reg.getCategory().getCategoryName());
        cMap.put("gender", reg.getCategory().getGender());
        map.put("category", cMap);

        Map<String, Object> pMap = new HashMap<>();
        pMap.put("id", reg.getPlayer().getId());
        pMap.put("name", reg.getPlayer().getUser().getFirstName() + " " + reg.getPlayer().getUser().getLastName());
        pMap.put("registrationNumber", reg.getPlayer().getRegistrationNumber());
        pMap.put("district", reg.getPlayer().getUser().getDistrict());
        map.put("player", pMap);

        return map;
    }

    @PostMapping
    public ResponseEntity<?> registerForTournament(@RequestBody Map<String, Object> body) {
        Object tIdObj = body.get("tournamentId");
        if (tIdObj == null || tIdObj.toString().trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Tournament ID is required");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        Object cIdObj = body.get("categoryId");
        if (cIdObj == null || cIdObj.toString().trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Category ID is required");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        Long tournamentId;
        try {
            tournamentId = tIdObj instanceof Number ? ((Number) tIdObj).longValue() : Long.valueOf(tIdObj.toString());
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid Tournament ID");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        Long categoryId;
        try {
            categoryId = cIdObj instanceof Number ? ((Number) cIdObj).longValue() : Long.valueOf(cIdObj.toString());
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid Category ID");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        User user = getAuthenticatedUser();
        Player player = playerRepository.findByUserId(user.getId()).orElse(null);
        if (player == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Player required.");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        Tournament t = tournamentRepository.findById(tournamentId).orElse(null);
        if (t == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Tournament not found");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        TournamentCategory c = categoryRepository.findById(categoryId).orElse(null);
        if (c == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Category not found");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        if (registrationRepository.existsByPlayerIdAndTournamentIdAndCategoryId(player.getId(), tournamentId, categoryId)) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "You are already registered in this category for this tournament.");
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(error);
        }

        TournamentRegistration reg = TournamentRegistration.builder()
                .tournament(t)
                .category(c)
                .player(player)
                .registrationDate(ZonedDateTime.now())
                .status(RegistrationStatus.REGISTERED)
                .paymentStatus("PENDING_PAYMENT")
                .build();

        reg = registrationRepository.save(reg);
        Map<String, Object> response = mapToResponse(reg);
        response.put("success", true);
        response.put("message", "Tournament registration successful");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getRegistrations(
            @RequestParam(required = false) Long tournamentId,
            @RequestParam(required = false) String status) {
        
        List<TournamentRegistration> list;
        User user = getAuthenticatedUser();

        if (user.getRole() != null && user.getRole().toUpperCase().contains("PLAYER")) {
            Player player = playerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Player profile not found"));
            list = registrationRepository.findByPlayerId(player.getId());
        } else {
            if (tournamentId != null) {
                list = registrationRepository.findByTournamentId(tournamentId);
            } else {
                list = registrationRepository.findAll();
            }
        }

        if (status != null && !status.isEmpty()) {
            list = list.stream()
                    .filter(r -> r.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> responses = list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        
        TournamentRegistration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if (body.containsKey("paymentStatus")) {
            String payStatus = (String) body.get("paymentStatus");
            reg.setPaymentStatus(payStatus.toUpperCase());
            if ("PAID".equalsIgnoreCase(payStatus)) {
                reg.setStatus(RegistrationStatus.CONFIRMED);
            } else if ("PENDING_PAYMENT".equalsIgnoreCase(payStatus)) {
                reg.setStatus(RegistrationStatus.REGISTERED);
            } else if ("REJECTED".equalsIgnoreCase(payStatus)) {
                reg.setStatus(RegistrationStatus.REJECTED);
            }
        } else if (body.containsKey("status")) {
            String status = (String) body.get("status");
            reg.setStatus(RegistrationStatus.valueOf(status.toUpperCase()));
            if ("CONFIRMED".equalsIgnoreCase(status)) {
                reg.setPaymentStatus("PAID");
            } else if ("REGISTERED".equalsIgnoreCase(status) || "PENDING".equalsIgnoreCase(status)) {
                reg.setPaymentStatus("PENDING_PAYMENT");
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                reg.setPaymentStatus("REJECTED");
            }
        }

        reg = registrationRepository.save(reg);
        return ResponseEntity.ok(mapToResponse(reg));
    }
}
