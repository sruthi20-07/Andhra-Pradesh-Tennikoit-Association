package com.apta.portal.audit.entity;

import com.apta.portal.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.ZonedDateTime;

@Entity
@Table(name = "audit_logs")
@EntityListeners(AuditingEntityListener.class)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    @Size(max = 30)
    @Column(name = "action_type", nullable = false, length = 30)
    private String actionType;

    @NotBlank
    @Size(max = 50)
    @Column(name = "table_name", nullable = false, length = 50)
    private String tableName;

    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "action_details", columnDefinition = "jsonb")
    private String actionDetails;

    @Size(max = 45)
    @Column(name = "client_ip", length = 45)
    private String clientIp;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    public AuditLog() {
    }

    public AuditLog(Long id, User user, String actionType, String tableName, Long recordId, String actionDetails, String clientIp, ZonedDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.actionType = actionType;
        this.tableName = tableName;
        this.recordId = recordId;
        this.actionDetails = actionDetails;
        this.clientIp = clientIp;
        this.createdAt = createdAt;
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

    public String getActionType() {
        return this.actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getTableName() {
        return this.tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public Long getRecordId() {
        return this.recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public String getActionDetails() {
        return this.actionDetails;
    }

    public void setActionDetails(String actionDetails) {
        this.actionDetails = actionDetails;
    }

    public String getClientIp() {
        return this.clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static AuditLogBuilder builder() {
        return new AuditLogBuilder();
    }

    public static class AuditLogBuilder {
        private Long id;
        private User user;
        private String actionType;
        private String tableName;
        private Long recordId;
        private String actionDetails;
        private String clientIp;
        private ZonedDateTime createdAt;

        public AuditLogBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AuditLogBuilder user(User user) {
            this.user = user;
            return this;
        }

        public AuditLogBuilder actionType(String actionType) {
            this.actionType = actionType;
            return this;
        }

        public AuditLogBuilder tableName(String tableName) {
            this.tableName = tableName;
            return this;
        }

        public AuditLogBuilder recordId(Long recordId) {
            this.recordId = recordId;
            return this;
        }

        public AuditLogBuilder actionDetails(String actionDetails) {
            this.actionDetails = actionDetails;
            return this;
        }

        public AuditLogBuilder clientIp(String clientIp) {
            this.clientIp = clientIp;
            return this;
        }

        public AuditLogBuilder createdAt(ZonedDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AuditLog build() {
            return new AuditLog(
                this.id,
                this.user,
                this.actionType,
                this.tableName,
                this.recordId,
                this.actionDetails,
                this.clientIp,
                this.createdAt
            );
        }
    }
}
