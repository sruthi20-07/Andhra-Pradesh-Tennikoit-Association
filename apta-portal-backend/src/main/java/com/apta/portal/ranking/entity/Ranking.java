package com.apta.portal.ranking.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.player.entity.Player;
import com.apta.portal.tournament.entity.TournamentCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "rankings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"player_id", "category_id"})
})
public class Ranking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private TournamentCategory category;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer points = 0;

    @NotNull
    @Min(1)
    @Column(name = "current_rank", nullable = false)
    private Integer currentRank;

    @NotNull
    @Column(name = "last_updated", nullable = false)
    private ZonedDateTime lastUpdated = ZonedDateTime.now();

    public Ranking() {
    }

    public Ranking(Long id, Player player, TournamentCategory category, Integer points, Integer currentRank, ZonedDateTime lastUpdated) {
        this.id = id;
        this.player = player;
        this.category = category;
        this.points = points;
        this.currentRank = currentRank;
        this.lastUpdated = lastUpdated;
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

    public TournamentCategory getCategory() {
        return this.category;
    }

    public void setCategory(TournamentCategory category) {
        this.category = category;
    }

    public Integer getPoints() {
        return this.points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getCurrentRank() {
        return this.currentRank;
    }

    public void setCurrentRank(Integer currentRank) {
        this.currentRank = currentRank;
    }

    public ZonedDateTime getLastUpdated() {
        return this.lastUpdated;
    }

    public void setLastUpdated(ZonedDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public static RankingBuilder builder() {
        return new RankingBuilder();
    }

    public static class RankingBuilder {
        private Long id;
        private Player player;
        private TournamentCategory category;
        private Integer points = 0;
        private Integer currentRank;
        private ZonedDateTime lastUpdated = ZonedDateTime.now();

        public RankingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RankingBuilder player(Player player) {
            this.player = player;
            return this;
        }

        public RankingBuilder category(TournamentCategory category) {
            this.category = category;
            return this;
        }

        public RankingBuilder points(Integer points) {
            this.points = points;
            return this;
        }

        public RankingBuilder currentRank(Integer currentRank) {
            this.currentRank = currentRank;
            return this;
        }

        public RankingBuilder lastUpdated(ZonedDateTime lastUpdated) {
            this.lastUpdated = lastUpdated;
            return this;
        }

        public Ranking build() {
            return new Ranking(
                this.id,
                this.player,
                this.category,
                this.points,
                this.currentRank,
                this.lastUpdated
            );
        }
    }
}
