package com.apta.portal.registration.repository;

import com.apta.portal.registration.entity.TournamentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRegistrationRepository extends JpaRepository<TournamentRegistration, Long> {
    List<TournamentRegistration> findByPlayerId(Long playerId);
    List<TournamentRegistration> findByTournamentId(Long tournamentId);
    List<TournamentRegistration> findByTournamentIdAndStatus(Long tournamentId, String status);
    boolean existsByPlayerIdAndTournamentIdAndCategoryId(Long playerId, Long tournamentId, Long categoryId);
}
