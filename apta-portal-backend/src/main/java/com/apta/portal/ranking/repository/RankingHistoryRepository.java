package com.apta.portal.ranking.repository;

import com.apta.portal.ranking.entity.RankingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RankingHistoryRepository extends JpaRepository<RankingHistory, Long> {
    List<RankingHistory> findByPlayerIdOrderByRecordedDateDesc(Long playerId);
}
