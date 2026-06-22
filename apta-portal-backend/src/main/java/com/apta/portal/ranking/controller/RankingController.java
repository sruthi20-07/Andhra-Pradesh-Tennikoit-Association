package com.apta.portal.ranking.controller;

import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.match.entity.MatchResult;
import com.apta.portal.match.repository.MatchResultRepository;
import com.apta.portal.player.entity.Player;
import com.apta.portal.player.repository.PlayerRepository;
import com.apta.portal.ranking.entity.Ranking;
import com.apta.portal.ranking.entity.RankingHistory;
import com.apta.portal.ranking.repository.RankingHistoryRepository;
import com.apta.portal.ranking.repository.RankingRepository;
import com.apta.portal.tournament.entity.TournamentCategory;
import com.apta.portal.tournament.repository.TournamentCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    @Autowired
    private RankingRepository rankingRepository;

    @Autowired
    private RankingHistoryRepository rankingHistoryRepository;

    @Autowired
    private MatchResultRepository matchResultRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TournamentCategoryRepository categoryRepository;

    private Map<String, Object> mapToResponse(Ranking r) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", r.getId());
        map.put("points", r.getPoints());
        map.put("currentRank", r.getCurrentRank());
        map.put("rank", r.getCurrentRank()); // dual support
        map.put("playerName", r.getPlayer().getUser().getFirstName() + " " + r.getPlayer().getUser().getLastName());
        map.put("district", r.getPlayer().getUser().getDistrict());
        map.put("state", r.getPlayer().getState());
        map.put("gender", r.getPlayer().getGender());
        map.put("ageGroup", r.getPlayer().getTennikoitCategory());
        map.put("lastUpdated", r.getLastUpdated());
        return map;
    }

    @GetMapping("/state")
    public ResponseEntity<List<Map<String, Object>>> getStateRankings(@RequestParam Long categoryId) {
        List<Ranking> list = rankingRepository.findByCategoryIdOrderByPointsDesc(categoryId);
        List<Map<String, Object>> responses = list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/district")
    public ResponseEntity<List<Map<String, Object>>> getDistrictRankings(
            @RequestParam Long categoryId,
            @RequestParam String district) {
        
        List<Ranking> list = rankingRepository.findByCategoryIdOrderByPointsDesc(categoryId);
        List<Map<String, Object>> responses = list.stream()
                .filter(r -> r.getPlayer().getUser().getDistrict().equalsIgnoreCase(district))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/calculate")
    @Transactional
    public ResponseEntity<Map<String, String>> calculateRankings() {
        // Fetch completed matches
        List<MatchResult> completedMatches = matchResultRepository.findByStatus("COMPLETED");

        // Map winner wins
        Map<String, Integer> playerCatWins = new HashMap<>();
        for (MatchResult m : completedMatches) {
            if (m.getWinner() != null) {
                String key = m.getWinner().getId() + "_" + m.getCategory().getId();
                playerCatWins.put(key, playerCatWins.getOrDefault(key, 0) + 1);
            }
        }

        // Fetch all categories and players
        List<TournamentCategory> categories = categoryRepository.findAll();
        List<Player> players = playerRepository.findAll().stream()
                .filter(p -> "APPROVED".equals(p.getStatus()))
                .collect(Collectors.toList());

        // Recalculate rankings for each category
        for (TournamentCategory cat : categories) {
            List<Ranking> categoryRankings = new ArrayList<>();
            for (Player player : players) {
                // Only rank player if gender matches or category is MIXED
                boolean genderMatch = cat.getGender().equals("MIXED") || 
                                     cat.getGender().equals(player.getGender());
                if (!genderMatch) continue;

                String key = player.getId() + "_" + cat.getId();
                int wins = playerCatWins.getOrDefault(key, 0);
                int points = wins * 100; // 100 points per completed match win

                Optional<Ranking> existingOpt = rankingRepository.findByPlayerIdAndCategoryId(player.getId(), cat.getId());
                Ranking ranking = existingOpt.orElseGet(() -> Ranking.builder()
                        .player(player)
                        .category(cat)
                        .points(0)
                        .currentRank(1)
                        .build());
                
                ranking.setPoints(points);
                ranking.setLastUpdated(ZonedDateTime.now());
                categoryRankings.add(ranking);
            }

            // Sort by points descending
            categoryRankings.sort((r1, r2) -> Integer.compare(r2.getPoints(), r1.getPoints()));

            // Assign ranks and save
            for (int i = 0; i < categoryRankings.size(); i++) {
                Ranking r = categoryRankings.get(i);
                r.setCurrentRank(i + 1);
                r = rankingRepository.save(r);

                // Log to history
                RankingHistory history = RankingHistory.builder()
                        .ranking(r)
                        .player(r.getPlayer())
                        .category(r.getCategory())
                        .points(r.getPoints())
                        .rankPosition(r.getCurrentRank())
                        .recordedDate(LocalDate.now())
                        .build();
                rankingHistoryRepository.save(history);
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Rankings recalculated successfully");
        return ResponseEntity.ok(response);
    }
}
