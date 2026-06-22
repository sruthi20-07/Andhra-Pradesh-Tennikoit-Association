package com.apta.portal.tournament.repository;

import com.apta.portal.tournament.entity.TournamentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentCategoryRepository extends JpaRepository<TournamentCategory, Long> {
    List<TournamentCategory> findByTournamentId(Long tournamentId);
}
