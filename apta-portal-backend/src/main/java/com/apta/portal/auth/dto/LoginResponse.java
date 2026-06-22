package com.apta.portal.auth.dto;

public class LoginResponse {
    private String token;
    private String accessToken;
    private String refreshToken;
    private String role;
    private Long userId;
    private UserDetailsDto user;

    public LoginResponse() {}

    public LoginResponse(String token, String accessToken, String refreshToken, String role, Long userId, UserDetailsDto user) {
        this.token = token;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.userId = userId;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public UserDetailsDto getUser() { return user; }
    public void setUser(UserDetailsDto user) { this.user = user; }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private String accessToken;
        private String refreshToken;
        private String role;
        private Long userId;
        private UserDetailsDto user;

        public LoginResponseBuilder token(String token) { this.token = token; return this; }
        public LoginResponseBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public LoginResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public LoginResponseBuilder role(String role) { this.role = role; return this; }
        public LoginResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public LoginResponseBuilder user(UserDetailsDto user) { this.user = user; return this; }

        public LoginResponse build() {
            return new LoginResponse(token, accessToken, refreshToken, role, userId, user);
        }
    }

    public static class UserDetailsDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String district;
        private String status;
        private Long playerId;
        private String playerStatus;
        private String registrationNumber;

        public UserDetailsDto() {}

        public UserDetailsDto(Long id, String name, String email, String role, String district, String status, Long playerId, String playerStatus, String registrationNumber) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.district = district;
            this.status = status;
            this.playerId = playerId;
            this.playerStatus = playerStatus;
            this.registrationNumber = registrationNumber;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getPlayerId() { return playerId; }
        public void setPlayerId(Long playerId) { this.playerId = playerId; }

        public String getPlayerStatus() { return playerStatus; }
        public void setPlayerStatus(String playerStatus) { this.playerStatus = playerStatus; }

        public String getRegistrationNumber() { return registrationNumber; }
        public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

        public static UserDetailsDtoBuilder builder() {
            return new UserDetailsDtoBuilder();
        }

        public static class UserDetailsDtoBuilder {
            private Long id;
            private String name;
            private String email;
            private String role;
            private String district;
            private String status;
            private Long playerId;
            private String playerStatus;
            private String registrationNumber;

            public UserDetailsDtoBuilder id(Long id) { this.id = id; return this; }
            public UserDetailsDtoBuilder name(String name) { this.name = name; return this; }
            public UserDetailsDtoBuilder email(String email) { this.email = email; return this; }
            public UserDetailsDtoBuilder role(String role) { this.role = role; return this; }
            public UserDetailsDtoBuilder district(String district) { this.district = district; return this; }
            public UserDetailsDtoBuilder status(String status) { this.status = status; return this; }
            public UserDetailsDtoBuilder playerId(Long playerId) { this.playerId = playerId; return this; }
            public UserDetailsDtoBuilder playerStatus(String playerStatus) { this.playerStatus = playerStatus; return this; }
            public UserDetailsDtoBuilder registrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; return this; }

            public UserDetailsDto build() {
                return new UserDetailsDto(id, name, email, role, district, status, playerId, playerStatus, registrationNumber);
            }
        }
    }
}
