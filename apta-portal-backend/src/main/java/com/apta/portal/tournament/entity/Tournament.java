package com.apta.portal.tournament.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.common.enums.TournamentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tournaments")
public class Tournament extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull
    @Column(name = "registration_deadline", nullable = false)
    private LocalDate registrationDeadline;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String venue;

    @Size(max = 150)
    @Column(length = 150)
    private String organizer;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "entry_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal entryFee = BigDecimal.ZERO;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private TournamentStatus status = TournamentStatus.DRAFT;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TournamentCategory> categories = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "tournament_id")
    private List<TournamentDocument> documents = new ArrayList<>();
    @Column(name = "brochure_url")
    private String brochureUrl;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "is_free")
    private Boolean isFree = true;

    public Tournament() {
    }

    public Tournament(Long id, String title, String description, LocalDate startDate, LocalDate endDate, LocalDate registrationDeadline, String venue, String organizer, BigDecimal entryFee, TournamentStatus status, List<TournamentCategory> categories, List<TournamentDocument> documents, String brochureUrl, Integer maxParticipants, Boolean isFree) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.registrationDeadline = registrationDeadline;
        this.venue = venue;
        this.organizer = organizer;
        this.entryFee = entryFee;
        this.status = status;
        this.categories = categories;
        this.documents = documents;
        this.brochureUrl = brochureUrl;
        this.maxParticipants = maxParticipants;
        this.isFree = isFree;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getRegistrationDeadline() {
        return this.registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDate registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public String getVenue() {
        return this.venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getOrganizer() {
        return this.organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public BigDecimal getEntryFee() {
        return this.entryFee;
    }

    public void setEntryFee(BigDecimal entryFee) {
        this.entryFee = entryFee;
    }

    public TournamentStatus getStatus() {
        return this.status;
    }

    public void setStatus(TournamentStatus status) {
        this.status = status;
    }

    public List<TournamentCategory> getCategories() {
        return this.categories;
    }

    public void setCategories(List<TournamentCategory> categories) {
        this.categories = categories;
    }

    public List<TournamentDocument> getDocuments() {
        return this.documents;
    }

    public void setDocuments(List<TournamentDocument> documents) {
        this.documents = documents;
    }

    public String getBrochureUrl() {
        return this.brochureUrl;
    }

    public void setBrochureUrl(String brochureUrl) {
        this.brochureUrl = brochureUrl;
    }

    public Integer getMaxParticipants() {
        return this.maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public Boolean getIsFree() {
        return this.isFree;
    }

    public void setIsFree(Boolean isFree) {
        this.isFree = isFree;
    }

    public static TournamentBuilder builder() {
        return new TournamentBuilder();
    }

    public static class TournamentBuilder {
        private Long id;
        private String title;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDate registrationDeadline;
        private String venue;
        private String organizer;
        private BigDecimal entryFee = BigDecimal.ZERO;
        private TournamentStatus status = TournamentStatus.DRAFT;
        private List<TournamentCategory> categories = new ArrayList<>();
        private List<TournamentDocument> documents = new ArrayList<>();
        private String brochureUrl;
        private Integer maxParticipants;
        private Boolean isFree = true;

        public TournamentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TournamentBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TournamentBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TournamentBuilder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public TournamentBuilder endDate(LocalDate endDate) {
            this.endDate = endDate;
            return this;
        }

        public TournamentBuilder registrationDeadline(LocalDate registrationDeadline) {
            this.registrationDeadline = registrationDeadline;
            return this;
        }

        public TournamentBuilder venue(String venue) {
            this.venue = venue;
            return this;
        }

        public TournamentBuilder organizer(String organizer) {
            this.organizer = organizer;
            return this;
        }

        public TournamentBuilder entryFee(BigDecimal entryFee) {
            this.entryFee = entryFee;
            return this;
        }

        public TournamentBuilder status(TournamentStatus status) {
            this.status = status;
            return this;
        }

        public TournamentBuilder categories(List<TournamentCategory> categories) {
            this.categories = categories;
            return this;
        }

        public TournamentBuilder documents(List<TournamentDocument> documents) {
            this.documents = documents;
            return this;
        }

        public TournamentBuilder brochureUrl(String brochureUrl) {
            this.brochureUrl = brochureUrl;
            return this;
        }

        public TournamentBuilder maxParticipants(Integer maxParticipants) {
            this.maxParticipants = maxParticipants;
            return this;
        }

        public TournamentBuilder isFree(Boolean isFree) {
            this.isFree = isFree;
            return this;
        }

        public Tournament build() {
            return new Tournament(
                this.id,
                this.title,
                this.description,
                this.startDate,
                this.endDate,
                this.registrationDeadline,
                this.venue,
                this.organizer,
                this.entryFee,
                this.status,
                this.categories,
                this.documents,
                this.brochureUrl,
                this.maxParticipants,
                this.isFree
            );
        }
    }
}
