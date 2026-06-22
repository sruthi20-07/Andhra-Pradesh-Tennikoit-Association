package com.apta.portal.payment.controller;

import com.apta.portal.common.enums.RegistrationStatus;
import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.payment.entity.Payment;
import com.apta.portal.payment.repository.PaymentRepository;
import com.apta.portal.player.entity.Player;
import com.apta.portal.player.repository.PlayerRepository;
import com.apta.portal.registration.entity.TournamentRegistration;
import com.apta.portal.registration.repository.TournamentRegistrationRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TournamentRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayerRepository playerRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getPaymentHistory(@RequestParam(required = false) Long playerId) {
        User user = getAuthenticatedUser();
        List<Payment> payments;

        if (user.getRole() != null && user.getRole().toUpperCase().contains("PLAYER")) {
            payments = paymentRepository.findByUserId(user.getId());
        } else {
            if (playerId != null) {
                Player player = playerRepository.findById(playerId)
                        .orElseThrow(() -> new ResourceNotFoundException("Player not found"));
                payments = paymentRepository.findByUserId(player.getUser().getId());
            } else {
                payments = paymentRepository.findAll();
            }
        }

        List<Map<String, Object>> responses = payments.stream()
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("amount", p.getAmount());
                    m.put("paymentStatus", p.getPaymentStatus());
                    m.put("transactionId", p.getTransactionId());
                    m.put("paymentGateway", p.getPaymentGateway());
                    m.put("paidAt", p.getPaidAt());
                    m.put("userName", p.getUser().getFirstName() + " " + p.getUser().getLastName());
                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}
