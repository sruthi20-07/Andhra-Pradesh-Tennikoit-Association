package com.apta.portal.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotBlank(message = "Date of birth is required")
    private String dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Father/Guardian name is required")
    private String fatherName;

    private String state;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Category is required")
    private String category;

    private String photoUrl;

    private Integer experienceYears;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String mobile, String dateOfBirth, String gender, String fatherName, String state, String district, String category, String photoUrl, Integer experienceYears) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.fatherName = fatherName;
        this.state = state;
        this.district = district;
        this.category = category;
        this.photoUrl = photoUrl;
        this.experienceYears = experienceYears;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public static RegisterRequestBuilder builder() {
        return new RegisterRequestBuilder();
    }

    public static class RegisterRequestBuilder {
        private String name;
        private String email;
        private String password;
        private String mobile;
        private String dateOfBirth;
        private String gender;
        private String fatherName;
        private String state;
        private String district;
        private String category;
        private String photoUrl;
        private Integer experienceYears;

        public RegisterRequestBuilder name(String name) { this.name = name; return this; }
        public RegisterRequestBuilder email(String email) { this.email = email; return this; }
        public RegisterRequestBuilder password(String password) { this.password = password; return this; }
        public RegisterRequestBuilder mobile(String mobile) { this.mobile = mobile; return this; }
        public RegisterRequestBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public RegisterRequestBuilder gender(String gender) { this.gender = gender; return this; }
        public RegisterRequestBuilder fatherName(String fatherName) { this.fatherName = fatherName; return this; }
        public RegisterRequestBuilder state(String state) { this.state = state; return this; }
        public RegisterRequestBuilder district(String district) { this.district = district; return this; }
        public RegisterRequestBuilder category(String category) { this.category = category; return this; }
        public RegisterRequestBuilder photoUrl(String photoUrl) { this.photoUrl = photoUrl; return this; }
        public RegisterRequestBuilder experienceYears(Integer experienceYears) { this.experienceYears = experienceYears; return this; }

        public RegisterRequest build() {
            return new RegisterRequest(name, email, password, mobile, dateOfBirth, gender, fatherName, state, district, category, photoUrl, experienceYears);
        }
    }
}
