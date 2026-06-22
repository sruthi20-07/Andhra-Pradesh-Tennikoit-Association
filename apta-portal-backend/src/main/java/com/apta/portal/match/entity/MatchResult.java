package com.apta.portal.match.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.player.entity.Player;
import com.apta.portal.tournament.entity.Tournament;
import com.apta.portal.tournament.entity.TournamentCategory;
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
@Table(name = "match_results")
public class MatchResult extends BaseEntity {

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

    @Size(max = 50)
    @Column(name = "round_name", length = 50)
    private String roundName;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player1_id", nullable = false)
    private Player player1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player2_id")
    private Player player2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private Player winner;

    @Column(name = "score_details", columnDefinition = "jsonb")
    private String scoreDetails;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String status = "SCHEDULED";

    @Column(name = "match_date")
    private ZonedDateTime matchDate;

    public MatchResult() {
    }

    public MatchResult(Long id, Tournament tournament, TournamentCategory category, String roundName, Player player1, Player player2, Player winner, String scoreDetails, String status, ZonedDateTime matchDate) {
        this.id = id;
        this.tournament = tournament;
        this.category = category;
        this.roundName = roundName;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = winner;
        this.scoreDetails = scoreDetails;
        this.status = status;
        this.matchDate = matchDate;
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

    public String getRoundName() {
        return this.roundName;
    }

    public void setRoundName(String roundName) {
        this.roundName = roundName;
    }

    public Player getPlayer1() {
        return this.player1;
    }

    public void setPlayer1(Player player1) {
        this.player1 = player1;
    }

    public Player getPlayer2() {
        return this.player2;
    }

    public void setPlayer2(Player player2) {
        this.player2 = player2;
    }

    public Player getWinner() {
        return this.winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
    }

    public String getScoreDetails() {
        return this.scoreDetails;
    }

    public void setScoreDetails(String scoreDetails) {
        this.scoreDetails = scoreDetails;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getMatchDate() {
        return this.matchDate;
    }

    public void setMatchDate(ZonedDateTime matchDate) {
        this.matchDate = matchDate;
    }

    public static MatchResultBuilder builder() {
        return new MatchResultBuilder();
    }

    public static class MatchResultBuilder {
        private Long id;
        private Tournament tournament;
        private TournamentCategory category;
        private String roundName;
        private Player player1;
        private Player player2;
        private Player winner;
        private String scoreDetails;
        private String status = "SCHEDULED";
        private ZonedDateTime matchDate;

        public MatchResultBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public MatchResultBuilder tournament(Tournament tournament) {
            this.tournament = tournament;
            return this;
        }

        public MatchResultBuilder category(TournamentCategory category) {
            this.category = category;
            return this;
        }

        public MatchResultBuilder roundName(String roundName) {
            this.roundName = roundName;
            return this;
        }

        public MatchResultBuilder player1(Player player1) {
            this.player1 = player1;
            return this;
        }

        public MatchResultBuilder player2(Player player2) {
            this.player2 = player2;
            return this;
        }

        public MatchResultBuilder winner(Player winner) {
            this.winner = winner;
            return this;
        }

        public MatchResultBuilder scoreDetails(String scoreDetails) {
            this.scoreDetails = scoreDetails;
            return this;
        }

        public MatchResultBuilder status(String status) {
            this.status = status;
            return this;
        }

        public MatchResultBuilder matchDate(ZonedDateTime matchDate) {
            this.matchDate = matchDate;
            return this;
        }

        public MatchResult build() {
            return new MatchResult(
                this.id,
                this.tournament,
                this.category,
                this.roundName,
                this.player1,
                this.player2,
                this.winner,
                this.scoreDetails,
                this.status,
                this.matchDate
            );
        }
    }
}
