package com.apta.portal.player.entity;

import com.apta.portal.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "player_achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerAchievement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Size(max = 30)
    @Column(name = "achievement_level", nullable = false, length = 30)
    private String achievementLevel;

    @NotNull
    @Column(name = "date_achieved", nullable = false)
    private LocalDate dateAchieved;

    @Column(name = "rank_position")
    private Integer rankPosition;

    @Size(max = 150)
    @Column(name = "tournament_name", length = 150)
    private String tournamentName;
}
