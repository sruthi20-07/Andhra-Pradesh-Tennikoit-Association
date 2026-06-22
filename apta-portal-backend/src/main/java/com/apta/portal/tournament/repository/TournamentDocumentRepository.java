package com.apta.portal.tournament.repository;

import com.apta.portal.tournament.entity.TournamentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TournamentDocumentRepository extends JpaRepository<TournamentDocument, Long> {
    List<TournamentDocument> findByTournamentId(Long tournamentId);
}
