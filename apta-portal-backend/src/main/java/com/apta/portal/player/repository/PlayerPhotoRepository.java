package com.apta.portal.player.repository;

import com.apta.portal.player.entity.PlayerPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerPhotoRepository extends JpaRepository<PlayerPhoto, Long> {
    List<PlayerPhoto> findByPlayerId(Long playerId);
}
