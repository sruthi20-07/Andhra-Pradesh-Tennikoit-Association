package com.apta.portal.certificate.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.player.entity.Player;
import com.apta.portal.registration.entity.TournamentRegistration;
import com.apta.portal.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "certificates")
public class Certificate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private TournamentRegistration registration;

    @NotBlank
    @Size(max = 30)
    @Column(name = "certificate_type", nullable = false, length = 30)
    private String certificateType; // "PARTICIPATION", "WINNER", "RUNNER"

    @NotBlank
    @Size(max = 100)
    @Column(name = "certificate_number", nullable = false, unique = true, length = 100)
    private String certificateNumber;

    @NotBlank
    @Size(max = 512)
    @Column(name = "file_url", nullable = false, length = 512)
    private String fileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by")
    private User issuedBy;

    @NotNull
    @Column(name = "issued_at", nullable = false)
    private ZonedDateTime issuedAt = ZonedDateTime.now();

    public Certificate() {
    }

    public Certificate(Long id, Player player, TournamentRegistration registration, String certificateType, String certificateNumber, String fileUrl, User issuedBy, ZonedDateTime issuedAt) {
        this.id = id;
        this.player = player;
        this.registration = registration;
        this.certificateType = certificateType;
        this.certificateNumber = certificateNumber;
        this.fileUrl = fileUrl;
        this.issuedBy = issuedBy;
        this.issuedAt = issuedAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Player getPlayer() {
        return this.player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public TournamentRegistration getRegistration() {
        return this.registration;
    }

    public void setRegistration(TournamentRegistration registration) {
        this.registration = registration;
    }

    public String getCertificateType() {
        return this.certificateType;
    }

    public void setCertificateType(String certificateType) {
        this.certificateType = certificateType;
    }

    public String getCertificateNumber() {
        return this.certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getFileUrl() {
        return this.fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public User getIssuedBy() {
        return this.issuedBy;
    }

    public void setIssuedBy(User issuedBy) {
        this.issuedBy = issuedBy;
    }

    public ZonedDateTime getIssuedAt() {
        return this.issuedAt;
    }

    public void setIssuedAt(ZonedDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public static CertificateBuilder builder() {
        return new CertificateBuilder();
    }

    public static class CertificateBuilder {
        private Long id;
        private Player player;
        private TournamentRegistration registration;
        private String certificateType;
        private String certificateNumber;
        private String fileUrl;
        private User issuedBy;
        private ZonedDateTime issuedAt = ZonedDateTime.now();

        public CertificateBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CertificateBuilder player(Player player) {
            this.player = player;
            return this;
        }

        public CertificateBuilder registration(TournamentRegistration registration) {
            this.registration = registration;
            return this;
        }

        public CertificateBuilder certificateType(String certificateType) {
            this.certificateType = certificateType;
            return this;
        }

        public CertificateBuilder certificateNumber(String certificateNumber) {
            this.certificateNumber = certificateNumber;
            return this;
        }

        public CertificateBuilder fileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
            return this;
        }

        public CertificateBuilder issuedBy(User issuedBy) {
            this.issuedBy = issuedBy;
            return this;
        }

        public CertificateBuilder issuedAt(ZonedDateTime issuedAt) {
            this.issuedAt = issuedAt;
            return this;
        }

        public Certificate build() {
            return new Certificate(
                this.id,
                this.player,
                this.registration,
                this.certificateType,
                this.certificateNumber,
                this.fileUrl,
                this.issuedBy,
                this.issuedAt
            );
        }
    }
}
