package com.apta.portal.download.repository;

import com.apta.portal.download.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByActiveTrue();
    boolean existsByObjectName(String objectName);
    boolean existsByFileUrl(String fileUrl);
}
