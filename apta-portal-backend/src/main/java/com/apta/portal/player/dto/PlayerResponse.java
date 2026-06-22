package com.apta.portal.player.dto;

import java.time.LocalDate;

public class PlayerResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String mobile;
    private LocalDate dateOfBirth;
    private String gender;
    private String fatherName;
    private String state;
    private String district;
    private String photoUrl;
    private String registrationNumber;
    private String tennikoitCategory;
    private String status;
    private Integer rank;

    public PlayerResponse() {}

    public PlayerResponse(Long id, Long userId, String name, String email, String mobile, LocalDate dateOfBirth, String gender, String fatherName, String state, String district, String photoUrl, String registrationNumber, String tennikoitCategory, String status, Integer rank) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.fatherName = fatherName;
        this.state = state;
        this.district = district;
        this.photoUrl = photoUrl;
        this.registrationNumber = registrationNumber;
        this.tennikoitCategory = tennikoitCategory;
        this.status = status;
        this.rank = rank;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getTennikoitCategory() { return tennikoitCategory; }
    public void setTennikoitCategory(String tennikoitCategory) { this.tennikoitCategory = tennikoitCategory; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public static PlayerResponseBuilder builder() {
        return new PlayerResponseBuilder();
    }

    public static class PlayerResponseBuilder {
        private Long id;
        private Long userId;
        private String name;
        private String email;
        private String mobile;
        private LocalDate dateOfBirth;
        private String gender;
        private String fatherName;
        private String state;
        private String district;
        private String photoUrl;
        private String registrationNumber;
        private String tennikoitCategory;
        private String status;
        private Integer rank;

        public PlayerResponseBuilder id(Long id) { this.id = id; return this; }
        public PlayerResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public PlayerResponseBuilder name(String name) { this.name = name; return this; }
        public PlayerResponseBuilder email(String email) { this.email = email; return this; }
        public PlayerResponseBuilder mobile(String mobile) { this.mobile = mobile; return this; }
        public PlayerResponseBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PlayerResponseBuilder gender(String gender) { this.gender = gender; return this; }
        public PlayerResponseBuilder fatherName(String fatherName) { this.fatherName = fatherName; return this; }
        public PlayerResponseBuilder state(String state) { this.state = state; return this; }
        public PlayerResponseBuilder district(String district) { this.district = district; return this; }
        public PlayerResponseBuilder photoUrl(String photoUrl) { this.photoUrl = photoUrl; return this; }
        public PlayerResponseBuilder registrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; return this; }
        public PlayerResponseBuilder tennikoitCategory(String tennikoitCategory) { this.tennikoitCategory = tennikoitCategory; return this; }
        public PlayerResponseBuilder status(String status) { this.status = status; return this; }
        public PlayerResponseBuilder rank(Integer rank) { this.rank = rank; return this; }

        public PlayerResponse build() {
            return new PlayerResponse(id, userId, name, email, mobile, dateOfBirth, gender, fatherName, state, district, photoUrl, registrationNumber, tennikoitCategory, status, rank);
        }
    }
}
