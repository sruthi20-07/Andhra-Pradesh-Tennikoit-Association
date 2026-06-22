package com.apta.portal.feedback.repository;

import com.apta.portal.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    java.util.List<Feedback> findAllByOrderByCreatedAtDesc();
}
