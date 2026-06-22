package com.apta.portal.tournament.repository;

import com.apta.portal.common.enums.TournamentStatus;
import com.apta.portal.tournament.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByStatus(TournamentStatus status);
    List<Tournament> findByStatusInOrderByStartDateAsc(List<TournamentStatus> statuses);
}
