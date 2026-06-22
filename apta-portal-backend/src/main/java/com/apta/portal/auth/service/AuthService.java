package com.apta.portal.auth.service;

import com.apta.portal.auth.dto.*;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    RefreshTokenResponse refreshToken(RefreshTokenRequest request);
}
