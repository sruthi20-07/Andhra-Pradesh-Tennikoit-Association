package com.apta.portal.certificate.repository;

import com.apta.portal.certificate.entity.Certificate;
import com.apta.portal.player.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByPlayer(Player player);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
}
