package com.apta.portal.registration.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.common.enums.RegistrationStatus;
import com.apta.portal.payment.entity.Payment;
import com.apta.portal.player.entity.Player;
import com.apta.portal.tournament.entity.Tournament;
import com.apta.portal.tournament.entity.TournamentCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "tournament_registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"player_id", "tournament_id", "category_id"})
})
public class TournamentRegistration extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private TournamentCategory category;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @NotNull
    @Column(name = "registration_date", nullable = false)
    private ZonedDateTime registrationDate = ZonedDateTime.now();

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    @NotNull
    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus = "PENDING_PAYMENT";

    public TournamentRegistration() {
    }

    public TournamentRegistration(Long id, Tournament tournament, TournamentCategory category, Player player, Payment payment, ZonedDateTime registrationDate, RegistrationStatus status, String paymentStatus) {
        this.id = id;
        this.tournament = tournament;
        this.category = category;
        this.player = player;
        this.payment = payment;
        this.registrationDate = registrationDate;
        this.status = status;
        this.paymentStatus = paymentStatus;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tournament getTournament() {
        return this.tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public TournamentCategory getCategory() {
        return this.category;
    }

    public void setCategory(TournamentCategory category) {
        this.category = category;
    }

    public Player getPlayer() {
        return this.player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Payment getPayment() {
        return this.payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public ZonedDateTime getRegistrationDate() {
        return this.registrationDate;
    }

    public void setRegistrationDate(ZonedDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public RegistrationStatus getStatus() {
        return this.status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return this.paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public static TournamentRegistrationBuilder builder() {
        return new TournamentRegistrationBuilder();
    }

    public static class TournamentRegistrationBuilder {
        private Long id;
        private Tournament tournament;
        private TournamentCategory category;
        private Player player;
        private Payment payment;
        private ZonedDateTime registrationDate = ZonedDateTime.now();
        private RegistrationStatus status = RegistrationStatus.PENDING;
        private String paymentStatus = "PENDING_PAYMENT";

        public TournamentRegistrationBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TournamentRegistrationBuilder tournament(Tournament tournament) {
            this.tournament = tournament;
            return this;
        }

        public TournamentRegistrationBuilder category(TournamentCategory category) {
            this.category = category;
            return this;
        }

        public TournamentRegistrationBuilder player(Player player) {
            this.player = player;
            return this;
        }

        public TournamentRegistrationBuilder payment(Payment payment) {
            this.payment = payment;
            return this;
        }

        public TournamentRegistrationBuilder registrationDate(ZonedDateTime registrationDate) {
            this.registrationDate = registrationDate;
            return this;
        }

        public TournamentRegistrationBuilder status(RegistrationStatus status) {
            this.status = status;
            return this;
        }

        public TournamentRegistrationBuilder paymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public TournamentRegistration build() {
            return new TournamentRegistration(
                this.id,
                this.tournament,
                this.category,
                this.player,
                this.payment,
                this.registrationDate,
                this.status,
                this.paymentStatus
            );
        }
    }
}
