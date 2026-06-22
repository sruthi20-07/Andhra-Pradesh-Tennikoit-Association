package com.apta.portal.player.repository;

import com.apta.portal.player.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>, JpaSpecificationExecutor<Player> {
    Optional<Player> findByUserId(Long userId);
    Optional<Player> findByRegistrationNumber(String registrationNumber);
    long countByRegistrationNumberStartingWith(String prefix);
}
