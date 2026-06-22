package com.apta.portal.auth.dto;

public class RefreshTokenResponse {
    private String token;
    private String refreshToken;

    public RefreshTokenResponse() {}

    public RefreshTokenResponse(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public static RefreshTokenResponseBuilder builder() {
        return new RefreshTokenResponseBuilder();
    }

    public static class RefreshTokenResponseBuilder {
        private String token;
        private String refreshToken;

        public RefreshTokenResponseBuilder token(String token) { this.token = token; return this; }
        public RefreshTokenResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }

        public RefreshTokenResponse build() {
            return new RefreshTokenResponse(token, refreshToken);
        }
    }
}
