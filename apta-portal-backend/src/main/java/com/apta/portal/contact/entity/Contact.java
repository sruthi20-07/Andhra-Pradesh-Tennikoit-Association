package com.apta.portal.contact.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
public class Contact {

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
    @Column(length = 15)
    private String phone;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String subject;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(length = 20)
    private String status = "OPEN";

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    public Contact() {
    }

    public Contact(Long id, String name, String email, String phone, String subject, String message, LocalDateTime createdAt, String status, String adminReply) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.subject = subject;
        this.message = message;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.status = status != null ? status : "OPEN";
        this.adminReply = adminReply;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminReply() {
        return adminReply;
    }

    public void setAdminReply(String adminReply) {
        this.adminReply = adminReply;
    }

    public static ContactBuilder builder() {
        return new ContactBuilder();
    }

    public static class ContactBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String subject;
        private String message;
        private LocalDateTime createdAt;
        private String status;
        private String adminReply;

        public ContactBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ContactBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ContactBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ContactBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public ContactBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public ContactBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ContactBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ContactBuilder status(String status) {
            this.status = status;
            return this;
        }

        public ContactBuilder adminReply(String adminReply) {
            this.adminReply = adminReply;
            return this;
        }

        public Contact build() {
            return new Contact(id, name, email, phone, subject, message, createdAt, status, adminReply);
        }
    }
}
