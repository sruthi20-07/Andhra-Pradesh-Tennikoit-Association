package com.apta.portal.grievance.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "grievances")
public class Grievance extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Size(max = 100)
    @Column(length = 100)
    private String name;

    @Email
    @Size(max = 150)
    @Column(length = 150)
    private String email;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String subject;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String status = "OPEN";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @Column(name = "resolution_details", columnDefinition = "TEXT")
    private String resolutionDetails;

    @Column(name = "resolved_at")
    private ZonedDateTime resolvedAt;

    public Grievance() {
    }

    public Grievance(Long id, User user, String name, String email, String subject, String description, String status, User resolvedBy, String resolutionDetails, ZonedDateTime resolvedAt) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.resolvedBy = resolvedBy;
        this.resolutionDetails = resolutionDetails;
        this.resolvedAt = resolvedAt;
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

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return this.subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getResolvedBy() {
        return this.resolvedBy;
    }

    public void setResolvedBy(User resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public String getResolutionDetails() {
        return this.resolutionDetails;
    }

    public void setResolutionDetails(String resolutionDetails) {
        this.resolutionDetails = resolutionDetails;
    }

    public ZonedDateTime getResolvedAt() {
        return this.resolvedAt;
    }

    public void setResolvedAt(ZonedDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public static GrievanceBuilder builder() {
        return new GrievanceBuilder();
    }

    public static class GrievanceBuilder {
        private Long id;
        private User user;
        private String name;
        private String email;
        private String subject;
        private String description;
        private String status = "OPEN";
        private User resolvedBy;
        private String resolutionDetails;
        private ZonedDateTime resolvedAt;

        public GrievanceBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GrievanceBuilder user(User user) {
            this.user = user;
            return this;
        }

        public GrievanceBuilder name(String name) {
            this.name = name;
            return this;
        }

        public GrievanceBuilder email(String email) {
            this.email = email;
            return this;
        }

        public GrievanceBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public GrievanceBuilder description(String description) {
            this.description = description;
            return this;
        }

        public GrievanceBuilder status(String status) {
            this.status = status;
            return this;
        }

        public GrievanceBuilder resolvedBy(User resolvedBy) {
            this.resolvedBy = resolvedBy;
            return this;
        }

        public GrievanceBuilder resolutionDetails(String resolutionDetails) {
            this.resolutionDetails = resolutionDetails;
            return this;
        }

        public GrievanceBuilder resolvedAt(ZonedDateTime resolvedAt) {
            this.resolvedAt = resolvedAt;
            return this;
        }

        public Grievance build() {
            return new Grievance(
                this.id,
                this.user,
                this.name,
                this.email,
                this.subject,
                this.description,
                this.status,
                this.resolvedBy,
                this.resolutionDetails,
                this.resolvedAt
            );
        }
    }
}
