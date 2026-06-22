package com.apta.portal.tournament.entity;

import com.apta.portal.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tournament_categories")
public class TournamentCategory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Tournament tournament;

    @NotBlank
    @Size(max = 50)
    @Column(name = "category_name", nullable = false, length = 50)
    private String categoryName;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String gender;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    public TournamentCategory() {
    }

    public TournamentCategory(Long id, Tournament tournament, String categoryName, String gender, Integer minAge, Integer maxAge) {
        this.id = id;
        this.tournament = tournament;
        this.categoryName = categoryName;
        this.gender = gender;
        this.minAge = minAge;
        this.maxAge = maxAge;
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

    public String getCategoryName() {
        return this.categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getGender() {
        return this.gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getMinAge() {
        return this.minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return this.maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    public static TournamentCategoryBuilder builder() {
        return new TournamentCategoryBuilder();
    }

    public static class TournamentCategoryBuilder {
        private Long id;
        private Tournament tournament;
        private String categoryName;
        private String gender;
        private Integer minAge;
        private Integer maxAge;

        public TournamentCategoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TournamentCategoryBuilder tournament(Tournament tournament) {
            this.tournament = tournament;
            return this;
        }

        public TournamentCategoryBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public TournamentCategoryBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public TournamentCategoryBuilder minAge(Integer minAge) {
            this.minAge = minAge;
            return this;
        }

        public TournamentCategoryBuilder maxAge(Integer maxAge) {
            this.maxAge = maxAge;
            return this;
        }

        public TournamentCategory build() {
            return new TournamentCategory(
                this.id,
                this.tournament,
                this.categoryName,
                this.gender,
                this.minAge,
                this.maxAge
            );
        }
    }
}
