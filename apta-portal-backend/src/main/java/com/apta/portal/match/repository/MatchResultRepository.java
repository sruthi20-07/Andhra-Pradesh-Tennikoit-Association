package com.apta.portal.match.repository;

import com.apta.portal.match.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    List<MatchResult> findByStatus(String status);
    List<MatchResult> findByTournamentIdAndCategoryId(Long tournamentId, Long categoryId);
}
