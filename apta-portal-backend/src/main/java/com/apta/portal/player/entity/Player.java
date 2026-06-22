package com.apta.portal.player.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "players")
public class Player extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotBlank
    @Size(max = 50)
    @Column(name = "registration_number", nullable = false, unique = true, length = 50)
    private String registrationNumber;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String gender;

    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @NotBlank
    @Size(max = 50)
    @Column(name = "tennikoit_category", nullable = false, length = 50)
    private String tennikoitCategory;

    @Size(max = 100)
    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Size(max = 50)
    @Column(name = "state", length = 50)
    private String state;

    @Size(max = 50)
    @Column(name = "district", length = 50)
    private String district;

    @Size(max = 512)
    @Column(name = "photo_url", length = 512)
    private String photoUrl;

    @NotBlank
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "id_proof_url")
    private String idProofUrl;

    @Column(name = "approved_at")
    private java.time.LocalDateTime approvedAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    public Player() {
    }

    public Player(Long id, User user, String registrationNumber, String gender, LocalDate dateOfBirth, String tennikoitCategory, String fatherName, String state, String district, String photoUrl, String status, Integer experienceYears, String idProofUrl, java.time.LocalDateTime approvedAt, Long approvedBy) {
        this.id = id;
        this.user = user;
        this.registrationNumber = registrationNumber;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.tennikoitCategory = tennikoitCategory;
        this.fatherName = fatherName;
        this.state = state;
        this.district = district;
        this.photoUrl = photoUrl;
        this.status = status;
        this.experienceYears = experienceYears;
        this.idProofUrl = idProofUrl;
        this.approvedAt = approvedAt;
        this.approvedBy = approvedBy;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRegistrationNumber() {
        return this.registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getGender() {
        return this.gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return this.dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getTennikoitCategory() {
        return this.tennikoitCategory;
    }

    public void setTennikoitCategory(String tennikoitCategory) {
        this.tennikoitCategory = tennikoitCategory;
    }

    public String getFatherName() {
        return this.fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return this.district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPhotoUrl() {
        return this.photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getExperienceYears() {
        return this.experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getIdProofUrl() {
        return this.idProofUrl;
    }

    public void setIdProofUrl(String idProofUrl) {
        this.idProofUrl = idProofUrl;
    }

    public java.time.LocalDateTime getApprovedAt() {
        return this.approvedAt;
    }

    public void setApprovedAt(java.time.LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public Long getApprovedBy() {
        return this.approvedBy;
    }

    public void setApprovedBy(Long approvedBy) {
        this.approvedBy = approvedBy;
    }

    public static PlayerBuilder builder() {
        return new PlayerBuilder();
    }

    public static class PlayerBuilder {
        private Long id;
        private User user;
        private String registrationNumber;
        private String gender;
        private LocalDate dateOfBirth;
        private String tennikoitCategory;
        private String fatherName;
        private String state;
        private String district;
        private String photoUrl;
        private String status;
        private Integer experienceYears;
        private String idProofUrl;
        private java.time.LocalDateTime approvedAt;
        private Long approvedBy;

        public PlayerBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PlayerBuilder user(User user) {
            this.user = user;
            return this;
        }

        public PlayerBuilder registrationNumber(String registrationNumber) {
            this.registrationNumber = registrationNumber;
            return this;
        }

        public PlayerBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public PlayerBuilder dateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
            return this;
        }

        public PlayerBuilder tennikoitCategory(String tennikoitCategory) {
            this.tennikoitCategory = tennikoitCategory;
            return this;
        }

        public PlayerBuilder fatherName(String fatherName) {
            this.fatherName = fatherName;
            return this;
        }

        public PlayerBuilder state(String state) {
            this.state = state;
            return this;
        }

        public PlayerBuilder district(String district) {
            this.district = district;
            return this;
        }

        public PlayerBuilder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public PlayerBuilder status(String status) {
            this.status = status;
            return this;
        }

        public PlayerBuilder experienceYears(Integer experienceYears) {
            this.experienceYears = experienceYears;
            return this;
        }

        public PlayerBuilder idProofUrl(String idProofUrl) {
            this.idProofUrl = idProofUrl;
            return this;
        }

        public PlayerBuilder approvedAt(java.time.LocalDateTime approvedAt) {
            this.approvedAt = approvedAt;
            return this;
        }

        public PlayerBuilder approvedBy(Long approvedBy) {
            this.approvedBy = approvedBy;
            return this;
        }

        public Player build() {
            return new Player(
                this.id,
                this.user,
                this.registrationNumber,
                this.gender,
                this.dateOfBirth,
                this.tennikoitCategory,
                this.fatherName,
                this.state,
                this.district,
                this.photoUrl,
                this.status,
                this.experienceYears,
                this.idProofUrl,
                this.approvedAt,
                this.approvedBy
            );
        }
    }
}
