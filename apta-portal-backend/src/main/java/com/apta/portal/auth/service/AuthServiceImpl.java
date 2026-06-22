package com.apta.portal.auth.service;

import com.apta.portal.auth.dto.*;
import com.apta.portal.exception.DuplicateResourceException;
import com.apta.portal.exception.UnauthorizedException;
import com.apta.portal.player.entity.Player;
import com.apta.portal.player.entity.PlayerPhoto;
import com.apta.portal.player.repository.PlayerRepository;
import com.apta.portal.player.repository.PlayerPhotoRepository;
import com.apta.portal.security.CustomUserDetailsService;
import com.apta.portal.security.jwt.JwtService;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PlayerPhotoRepository playerPhotoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check email uniqueness only
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered. Please login or use different email.");
        }
        if (userRepository.existsByPhoneNumber(request.getMobile())) {
            throw new DuplicateResourceException("Mobile number already registered.");
        }

        String yearPrefix = "APTA-" + LocalDate.now().getYear() + "-";
        long seq = playerRepository.countByRegistrationNumberStartingWith(yearPrefix) + 1;
        String regNumber = yearPrefix + String.format("%04d", seq);

        // Split name into firstName and lastName
        String[] nameParts = request.getName().trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : ".";

        // Create and save User
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_PLAYER")
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber(request.getMobile())
                .district(request.getDistrict())
                .status("ACTIVE")
                .build();
        User savedUser = userRepository.save(user);
        System.out.println("User Saved");

        // Create and save Player
        Player player = Player.builder()
                .user(savedUser)
                .fatherName(request.getFatherName())
                .gender(request.getGender())
                .dateOfBirth(LocalDate.parse(request.getDateOfBirth()))
                .district(request.getDistrict())
                .state(request.getState() != null && !request.getState().isBlank() ? request.getState() : "Andhra Pradesh")
                .tennikoitCategory(request.getCategory())
                .status("PENDING")
                .registrationNumber(regNumber)
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 0)
                .photoUrl(request.getPhotoUrl())
                .build();
        Player savedPlayer = playerRepository.save(player);
        System.out.println("Player Saved");

        // Save PlayerPhoto record if photoUrl is present
        if (request.getPhotoUrl() != null && !request.getPhotoUrl().isBlank()) {
            PlayerPhoto playerPhoto = PlayerPhoto.builder()
                    .player(savedPlayer)
                    .photoUrl(request.getPhotoUrl())
                    .build();
            playerPhotoRepository.save(playerPhoto);
            System.out.println("Photo Saved");
        }
        System.out.println("Transaction Committed");

        // Generate tokens immediately
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Return response
        return AuthResponse.builder()
                .success(true)
                .message("Registration submitted successfully.")
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .userId(savedUser.getId())
                .token(token)
                .accessToken(token)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new UnauthorizedException("Account is inactive. Contact administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Find player profile if exists
        Player player = playerRepository.findByUserId(user.getId()).orElse(null);
        if (player != null && !"APPROVED".equalsIgnoreCase(player.getStatus())) {
            throw new UnauthorizedException("Your player account is pending approval by administrator.");
        }

        return LoginResponse.builder()
                .token(token)
                .accessToken(token)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .userId(user.getId())
                .user(LoginResponse.UserDetailsDto.builder()
                        .id(user.getId())
                        .name(user.getFirstName() + " " + user.getLastName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .district(user.getDistrict())
                        .status(user.getStatus())
                        .playerId(player != null ? player.getId() : null)
                        .playerStatus(player != null ? player.getStatus() : null)
                        .registrationNumber(player != null ? player.getRegistrationNumber() : null)
                        .build())
                .build();
    }

    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        String username = jwtService.extractUsername(token);

        if (username != null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, userDetails)) {
                String accessToken = jwtService.generateToken(userDetails);
                return RefreshTokenResponse.builder()
                        .token(accessToken)
                        .refreshToken(token)
                        .build();
            }
        }
        throw new UnauthorizedException("Invalid refresh token");
    }
}
