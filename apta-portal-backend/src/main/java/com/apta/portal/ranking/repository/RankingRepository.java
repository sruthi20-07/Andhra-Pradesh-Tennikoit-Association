package com.apta.portal.ranking.repository;

import com.apta.portal.ranking.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long>, JpaSpecificationExecutor<Ranking> {
    Optional<Ranking> findByPlayerIdAndCategoryId(Long playerId, Long categoryId);
    List<Ranking> findByCategoryIdOrderByPointsDesc(Long categoryId);
}
