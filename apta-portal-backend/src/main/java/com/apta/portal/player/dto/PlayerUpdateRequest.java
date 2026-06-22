package com.apta.portal.player.dto;

public class PlayerUpdateRequest {
    private String name;
    private String mobile;
    private String dateOfBirth;
    private String gender;
    private String fatherName;
    private String district;
    private String photoUrl;
    private String tennikoitCategory;

    public PlayerUpdateRequest() {}

    public PlayerUpdateRequest(String name, String mobile, String dateOfBirth, String gender, String fatherName, String district, String photoUrl, String tennikoitCategory) {
        this.name = name;
        this.mobile = mobile;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.fatherName = fatherName;
        this.district = district;
        this.photoUrl = photoUrl;
        this.tennikoitCategory = tennikoitCategory;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getTennikoitCategory() { return tennikoitCategory; }
    public void setTennikoitCategory(String tennikoitCategory) { this.tennikoitCategory = tennikoitCategory; }

    public static PlayerUpdateRequestBuilder builder() {
        return new PlayerUpdateRequestBuilder();
    }

    public static class PlayerUpdateRequestBuilder {
        private String name;
        private String mobile;
        private String dateOfBirth;
        private String gender;
        private String fatherName;
        private String district;
        private String photoUrl;
        private String tennikoitCategory;

        public PlayerUpdateRequestBuilder name(String name) { this.name = name; return this; }
        public PlayerUpdateRequestBuilder mobile(String mobile) { this.mobile = mobile; return this; }
        public PlayerUpdateRequestBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PlayerUpdateRequestBuilder gender(String gender) { this.gender = gender; return this; }
        public PlayerUpdateRequestBuilder fatherName(String fatherName) { this.fatherName = fatherName; return this; }
        public PlayerUpdateRequestBuilder district(String district) { this.district = district; return this; }
        public PlayerUpdateRequestBuilder photoUrl(String photoUrl) { this.photoUrl = photoUrl; return this; }
        public PlayerUpdateRequestBuilder tennikoitCategory(String tennikoitCategory) { this.tennikoitCategory = tennikoitCategory; return this; }

        public PlayerUpdateRequest build() {
            return new PlayerUpdateRequest(name, mobile, dateOfBirth, gender, fatherName, district, photoUrl, tennikoitCategory);
        }
    }
}
