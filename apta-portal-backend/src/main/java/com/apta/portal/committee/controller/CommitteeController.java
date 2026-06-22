package com.apta.portal.committee.controller;

import com.apta.portal.committee.entity.CommitteeMember;
import com.apta.portal.committee.repository.CommitteeMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/committee")
public class CommitteeController {

    @Autowired
    private CommitteeMemberRepository committeeRepository;

    private Map<String, Object> mapToResponse(CommitteeMember m) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", m.getId());
        map.put("name", m.getName() != null ? m.getName() : 
                        (m.getUser() != null ? m.getUser().getFirstName() + " " + m.getUser().getLastName() : ""));
        map.put("role", m.getRole() != null ? m.getRole() : m.getDesignation());
        map.put("district", m.getDistrict() != null ? m.getDistrict() : 
                            (m.getUser() != null ? m.getUser().getDistrict() : ""));
        map.put("contact", m.getContact() != null ? m.getContact() : 
                           (m.getUser() != null ? m.getUser().getEmail() : ""));
        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMembers() {
        List<CommitteeMember> list = committeeRepository.findAll();
        List<Map<String, Object>> responses = list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createMember(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String role = (String) body.get("role");
        String district = (String) body.get("district");
        String contact = (String) body.get("contact");

        CommitteeMember m = CommitteeMember.builder()
                .name(name)
                .role(role)
                .district(district)
                .contact(contact)
                .designation(role)
                .termStart(LocalDate.now())
                .active(true)
                .displayOrder(0)
                .build();

        m = committeeRepository.save(m);
        return ResponseEntity.ok(mapToResponse(m));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (committeeRepository.existsById(id)) {
            committeeRepository.deleteById(id);
        }
        return ResponseEntity.ok().build();
    }
}
