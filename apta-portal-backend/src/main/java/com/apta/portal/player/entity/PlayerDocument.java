package com.apta.portal.player.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "player_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @NotBlank
    @Size(max = 30)
    @Column(name = "document_type", nullable = false, length = 30)
    private String documentType;

    @NotBlank
    @Size(max = 512)
    @Column(name = "file_url", nullable = false, length = 512)
    private String fileUrl;

    @Builder.Default
    @NotBlank
    @Size(max = 20)
    @Column(name = "verification_status", nullable = false, length = 20)
    private String verificationStatus = "PENDING";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Size(max = 255)
    @Column(name = "rejection_comments", length = 255)
    private String rejectionComments;

    @Column(name = "verified_at")
    private ZonedDateTime verifiedAt;
}
