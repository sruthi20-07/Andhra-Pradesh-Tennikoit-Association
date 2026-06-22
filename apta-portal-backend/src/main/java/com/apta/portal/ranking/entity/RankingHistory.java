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

import java.time.LocalDate;

@Entity
@Table(name = "ranking_histories")
public class RankingHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ranking_id", nullable = false)
    private Ranking ranking;

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
    private Integer points;

    @NotNull
    @Min(1)
    @Column(name = "rank_position", nullable = false)
    private Integer rankPosition;

    @NotNull
    @Column(name = "recorded_date", nullable = false)
    private LocalDate recordedDate = LocalDate.now();

    public RankingHistory() {
    }

    public RankingHistory(Long id, Ranking ranking, Player player, TournamentCategory category, Integer points, Integer rankPosition, LocalDate recordedDate) {
        this.id = id;
        this.ranking = ranking;
        this.player = player;
        this.category = category;
        this.points = points;
        this.rankPosition = rankPosition;
        this.recordedDate = recordedDate;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ranking getRanking() {
        return this.ranking;
    }

    public void setRanking(Ranking ranking) {
        this.ranking = ranking;
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

    public Integer getRankPosition() {
        return this.rankPosition;
    }

    public void setRankPosition(Integer rankPosition) {
        this.rankPosition = rankPosition;
    }

    public LocalDate getRecordedDate() {
        return this.recordedDate;
    }

    public void setRecordedDate(LocalDate recordedDate) {
        this.recordedDate = recordedDate;
    }

    public static RankingHistoryBuilder builder() {
        return new RankingHistoryBuilder();
    }

    public static class RankingHistoryBuilder {
        private Long id;
        private Ranking ranking;
        private Player player;
        private TournamentCategory category;
        private Integer points;
        private Integer rankPosition;
        private LocalDate recordedDate = LocalDate.now();

        public RankingHistoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public RankingHistoryBuilder ranking(Ranking ranking) {
            this.ranking = ranking;
            return this;
        }

        public RankingHistoryBuilder player(Player player) {
            this.player = player;
            return this;
        }

        public RankingHistoryBuilder category(TournamentCategory category) {
            this.category = category;
            return this;
        }

        public RankingHistoryBuilder points(Integer points) {
            this.points = points;
            return this;
        }

        public RankingHistoryBuilder rankPosition(Integer rankPosition) {
            this.rankPosition = rankPosition;
            return this;
        }

        public RankingHistoryBuilder recordedDate(LocalDate recordedDate) {
            this.recordedDate = recordedDate;
            return this;
        }

        public RankingHistory build() {
            return new RankingHistory(
                this.id,
                this.ranking,
                this.player,
                this.category,
                this.points,
                this.rankPosition,
                this.recordedDate
            );
        }
    }
}
