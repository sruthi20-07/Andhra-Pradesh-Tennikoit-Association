package com.apta.portal.committee.entity;

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
@Table(name = "committee_members")
public class CommitteeMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String role;
    private String district;
    private String contact;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "term_start")
    private LocalDate termStart;

    @Column(name = "term_end")
    private LocalDate termEnd;

    @Size(max = 512)
    @Column(name = "profile_image_url", length = 512)
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @NotNull
    @Column(nullable = false)
    private Boolean active = true;

    @NotNull
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    public CommitteeMember() {
    }

    public CommitteeMember(Long id, User user, String name, String role, String district, String contact, String designation, LocalDate termStart, LocalDate termEnd, String photoUrl, String bio, Boolean active, Integer displayOrder) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.role = role;
        this.district = district;
        this.contact = contact;
        this.designation = designation;
        this.termStart = termStart;
        this.termEnd = termEnd;
        this.photoUrl = photoUrl;
        this.bio = bio;
        this.active = active;
        this.displayOrder = displayOrder;
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

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDistrict() {
        return this.district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getContact() {
        return this.contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDesignation() {
        return this.designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public LocalDate getTermStart() {
        return this.termStart;
    }

    public void setTermStart(LocalDate termStart) {
        this.termStart = termStart;
    }

    public LocalDate getTermEnd() {
        return this.termEnd;
    }

    public void setTermEnd(LocalDate termEnd) {
        this.termEnd = termEnd;
    }

    public String getPhotoUrl() {
        return this.photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getBio() {
        return this.bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Boolean getActive() {
        return this.active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getDisplayOrder() {
        return this.displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public static CommitteeMemberBuilder builder() {
        return new CommitteeMemberBuilder();
    }

    public static class CommitteeMemberBuilder {
        private Long id;
        private User user;
        private String name;
        private String role;
        private String district;
        private String contact;
        private String designation;
        private LocalDate termStart;
        private LocalDate termEnd;
        private String photoUrl;
        private String bio;
        private Boolean active = true;
        private Integer displayOrder = 0;

        public CommitteeMemberBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CommitteeMemberBuilder user(User user) {
            this.user = user;
            return this;
        }

        public CommitteeMemberBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CommitteeMemberBuilder role(String role) {
            this.role = role;
            return this;
        }

        public CommitteeMemberBuilder district(String district) {
            this.district = district;
            return this;
        }

        public CommitteeMemberBuilder contact(String contact) {
            this.contact = contact;
            return this;
        }

        public CommitteeMemberBuilder designation(String designation) {
            this.designation = designation;
            return this;
        }

        public CommitteeMemberBuilder termStart(LocalDate termStart) {
            this.termStart = termStart;
            return this;
        }

        public CommitteeMemberBuilder termEnd(LocalDate termEnd) {
            this.termEnd = termEnd;
            return this;
        }

        public CommitteeMemberBuilder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public CommitteeMemberBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public CommitteeMemberBuilder active(Boolean active) {
            this.active = active;
            return this;
        }

        public CommitteeMemberBuilder displayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
            return this;
        }

        public CommitteeMember build() {
            return new CommitteeMember(
                this.id,
                this.user,
                this.name,
                this.role,
                this.district,
                this.contact,
                this.designation,
                this.termStart,
                this.termEnd,
                this.photoUrl,
                this.bio,
                this.active,
                this.displayOrder
            );
        }
    }
}
