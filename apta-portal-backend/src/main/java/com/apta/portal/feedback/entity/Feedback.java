package com.apta.portal.feedback.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.apta.portal.player.entity.Player;
import com.apta.portal.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@EntityListeners(AuditingEntityListener.class)
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String email;

    @Size(max = 15)
    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String subject;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Min(1)
    @Max(5)
    private Integer rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Column(length = 20)
    private String status = "NEW";

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Feedback() {
    }

    public Feedback(Long id, String name, String email, String phoneNumber, String subject, String message, Integer rating, Player player, User user, String status, String adminReply, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.subject = subject;
        this.message = message;
        this.rating = rating;
        this.player = player;
        this.user = user;
        this.status = status != null ? status : "NEW";
        this.adminReply = adminReply;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSubject() {
        return this.subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getRating() {
        return this.rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public Player getPlayer() {
        return this.player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminReply() {
        return this.adminReply;
    }

    public void setAdminReply(String adminReply) {
        this.adminReply = adminReply;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static FeedbackBuilder builder() {
        return new FeedbackBuilder();
    }

    public static class FeedbackBuilder {
        private Long id;
        private String name;
        private String email;
        private String phoneNumber;
        private String subject;
        private String message;
        private Integer rating;
        private Player player;
        private User user;
        private String status;
        private String adminReply;
        private LocalDateTime createdAt;

        public FeedbackBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public FeedbackBuilder name(String name) {
            this.name = name;
            return this;
        }

        public FeedbackBuilder email(String email) {
            this.email = email;
            return this;
        }

        public FeedbackBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public FeedbackBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public FeedbackBuilder message(String message) {
            this.message = message;
            return this;
        }

        public FeedbackBuilder rating(Integer rating) {
            this.rating = rating;
            return this;
        }

        public FeedbackBuilder player(Player player) {
            this.player = player;
            return this;
        }

        public FeedbackBuilder user(User user) {
            this.user = user;
            return this;
        }

        public FeedbackBuilder status(String status) {
            this.status = status;
            return this;
        }

        public FeedbackBuilder adminReply(String adminReply) {
            this.adminReply = adminReply;
            return this;
        }

        public FeedbackBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Feedback build() {
            return new Feedback(
                this.id,
                this.name,
                this.email,
                this.phoneNumber,
                this.subject,
                this.message,
                this.rating,
                this.player,
                this.user,
                this.status,
                this.adminReply,
                this.createdAt
            );
        }
    }
}
