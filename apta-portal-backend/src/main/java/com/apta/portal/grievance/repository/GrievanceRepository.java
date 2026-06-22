package com.apta.portal.grievance.repository;

import com.apta.portal.grievance.entity.Grievance;
import com.apta.portal.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    List<Grievance> findByUser(User user);
}
