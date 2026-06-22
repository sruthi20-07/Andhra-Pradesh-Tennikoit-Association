package com.apta.portal.committee.repository;

import com.apta.portal.committee.entity.CommitteeMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommitteeMemberRepository extends JpaRepository<CommitteeMember, Long> {
    List<CommitteeMember> findByActiveTrueOrderByDisplayOrderAsc();
}
