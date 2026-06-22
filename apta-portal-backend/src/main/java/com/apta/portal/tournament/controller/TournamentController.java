package com.apta.portal.tournament.controller;

import com.apta.portal.common.enums.TournamentStatus;
import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.tournament.entity.Tournament;
import com.apta.portal.tournament.entity.TournamentCategory;
import com.apta.portal.tournament.entity.TournamentDocument;
import com.apta.portal.tournament.repository.TournamentCategoryRepository;
import com.apta.portal.tournament.repository.TournamentRepository;
import com.apta.portal.tournament.dto.TournamentCreateRequest;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import com.apta.portal.download.entity.Download;
import com.apta.portal.security.jwt.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Sort;
import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/tournaments", "/api/admin/tournaments"})
public class TournamentController {

    private static final Logger log = LoggerFactory.getLogger(TournamentController.class);

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private TournamentCategoryRepository categoryRepository;

    @Autowired
    private com.apta.portal.tournament.repository.TournamentDocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private com.apta.portal.download.repository.DownloadRepository downloadRepository;

    private boolean isAdminFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        try {
            String username = jwtService.extractUsername(token);
            if (username == null) {
                return false;
            }
            return userRepository.findByEmail(username)
                    .map(user -> {
                        String r = user.getRole().toUpperCase();
                        return r.contains("ADMIN");
                    })
                    .orElse(false);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping
    public ResponseEntity<?> getTournaments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        boolean isAdmin = authHeader != null && isAdminFromToken(authHeader);

        List<Tournament> tournaments;
        if (isAdmin) {
            tournaments = tournamentRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        } else if (status != null && !status.isEmpty()) {
            tournaments = tournamentRepository.findByStatus(TournamentStatus.valueOf(status.toUpperCase()));
        } else {
            tournaments = tournamentRepository.findByStatusInOrderByStartDateAsc(
                List.of(TournamentStatus.PUBLISHED, TournamentStatus.UPCOMING, TournamentStatus.ACTIVE, TournamentStatus.ONGOING)
            );
        }
        return ResponseEntity.ok(Map.of("success", true, "data", tournaments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with ID " + id));
        return ResponseEntity.ok(tournament);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTournament(@RequestBody TournamentCreateRequest req) {
        Tournament t = new Tournament();
        t.setTitle(req.getTitle());
        t.setDescription(req.getDescription());
        t.setVenue(req.getVenue());
        t.setOrganizer(req.getOrganizer() != null ? req.getOrganizer() : "APTA");
        t.setStartDate(req.getStartDate());
        t.setEndDate(req.getEndDate());
        
        if (req.getRegistrationDeadline() != null) {
            String deadlineStr = req.getRegistrationDeadline();
            if (deadlineStr.contains("T")) {
                deadlineStr = deadlineStr.substring(0, 10);
            }
            t.setRegistrationDeadline(LocalDate.parse(deadlineStr));
        }
        
        t.setEntryFee(req.getEntryFee() != null ? req.getEntryFee() : BigDecimal.ZERO);
        t.setStatus(req.getStatus() != null ? TournamentStatus.valueOf(req.getStatus().toUpperCase()) : TournamentStatus.DRAFT);
        t.setIsFree(req.getEntryFee() == null || req.getEntryFee().compareTo(BigDecimal.ZERO) == 0);
        Tournament saved = tournamentRepository.save(t);

        if (req.getCategories() != null) {
            saved.getCategories().clear();
            for (TournamentCreateRequest.CategoryRequest cat : req.getCategories()) {
                TournamentCategory tc = new TournamentCategory();
                tc.setTournament(saved);
                tc.setCategoryName(cat.getCategoryName());
                tc.setGender(cat.getGender());
                tc.setMinAge(cat.getMinAge());
                tc.setMaxAge(cat.getMaxAge());
                saved.getCategories().add(tc);
            }
        }

        if (req.getDocuments() != null) {
            saved.getDocuments().clear();
            for (TournamentCreateRequest.DocumentRequest doc : req.getDocuments()) {
                TournamentDocument td = TournamentDocument.builder()
                        .tournamentId(saved.getId())
                        .fileName(doc.getFileName())
                        .filePath(doc.getFilePath())
                        .fileType(doc.getFileType())
                        .build();
                saved.getDocuments().add(td);
                if ("BROCHURE".equalsIgnoreCase(doc.getFileType())) {
                    saved.setBrochureUrl(doc.getFilePath());
                }
                syncTournamentDocumentToDownloads(saved, doc.getFileName(), doc.getFilePath(), doc.getFileType());
            }
        }
        saved = tournamentRepository.save(saved);

        return ResponseEntity.status(201).body(Map.of(
            "success", true,
            "message", "Tournament created successfully",
            "id", saved.getId()
        ));
    }

    @PutMapping("/{id}")
    @Transactional
    @SuppressWarnings("unchecked")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Tournament t = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found"));
        t = mapFromMap(body, t);
        t = tournamentRepository.save(t);

        if (body.containsKey("categories")) {
            t.getCategories().clear();
            List<Map<String, Object>> cats = (List<Map<String, Object>>) body.get("categories");
            for (Map<String, Object> catMap : cats) {
                TournamentCategory cat = mapCategoryFromMap(catMap, new TournamentCategory());
                cat.setTournament(t);
                t.getCategories().add(cat);
            }
        }

        if (body.containsKey("documents")) {
            t.getDocuments().clear();
            List<Map<String, Object>> docs = (List<Map<String, Object>>) body.get("documents");
            for (Map<String, Object> docMap : docs) {
                TournamentDocument doc = TournamentDocument.builder()
                        .tournamentId(t.getId())
                        .fileName((String) docMap.get("fileName"))
                        .filePath((String) docMap.get("filePath"))
                        .fileType((String) docMap.get("fileType"))
                        .build();
                t.getDocuments().add(doc);
                if ("BROCHURE".equalsIgnoreCase(doc.getFileType())) {
                    t.setBrochureUrl(doc.getFilePath());
                }
                syncTournamentDocumentToDownloads(t, doc.getFileName(), doc.getFilePath(), doc.getFileType());
            }
        }

        return ResponseEntity.ok(t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        Tournament t = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found"));
        tournamentRepository.delete(t);
        return ResponseEntity.ok().build();
    }

    private Tournament mapFromMap(Map<String, Object> map, Tournament t) {
        if (map.containsKey("title")) t.setTitle((String) map.get("title"));
        if (map.containsKey("description")) t.setDescription((String) map.get("description"));
        if (map.containsKey("venue")) t.setVenue((String) map.get("venue"));
        if (map.containsKey("organizer")) t.setOrganizer((String) map.get("organizer"));
        if (map.containsKey("entryFee")) {
            Object fee = map.get("entryFee");
            if (fee instanceof Number) {
                t.setEntryFee(BigDecimal.valueOf(((Number) fee).doubleValue()));
            } else if (fee instanceof String) {
                t.setEntryFee(new BigDecimal((String) fee));
            }
        }
        if (map.containsKey("startDate")) t.setStartDate(LocalDate.parse((String) map.get("startDate")));
        if (map.containsKey("endDate")) t.setEndDate(LocalDate.parse((String) map.get("endDate")));
        if (map.containsKey("registrationDeadline")) {
            String deadlineStr = (String) map.get("registrationDeadline");
            if (deadlineStr.contains("T")) {
                deadlineStr = deadlineStr.substring(0, 10);
            }
            t.setRegistrationDeadline(LocalDate.parse(deadlineStr));
        }
        if (map.containsKey("status")) {
            String statusStr = ((String) map.get("status")).toUpperCase();
            t.setStatus(TournamentStatus.valueOf(statusStr));
        }
        return t;
    }

    private TournamentCategory mapCategoryFromMap(Map<String, Object> map, TournamentCategory cat) {
        if (map.containsKey("categoryName")) cat.setCategoryName((String) map.get("categoryName"));
        if (map.containsKey("gender")) {
            cat.setGender(((String) map.get("gender")).toUpperCase());
        }
        if (map.containsKey("minAge")) cat.setMinAge((Integer) map.get("minAge"));
        if (map.containsKey("maxAge")) cat.setMaxAge((Integer) map.get("maxAge"));
        return cat;
    }

    private void syncTournamentDocumentToDownloads(Tournament t, String fileName, String filePath, String fileType) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return;
        }
        try {
            String objectName = null;
            if (filePath.contains("objectName=")) {
                int idx = filePath.indexOf("objectName=");
                objectName = filePath.substring(idx + "objectName=".length());
                if (objectName.contains("&")) {
                    objectName = objectName.substring(0, objectName.indexOf("&"));
                }
            } else {
                objectName = filePath.substring(filePath.lastIndexOf("/") + 1);
            }

            String fileUrl = "/api/files/download?objectName=" + objectName;
            if (downloadRepository.existsByObjectName(objectName) || downloadRepository.existsByFileUrl(fileUrl)) {
                return;
            }

            String category = "CIRCULARS";
            String type = "PDF";
            if (fileType != null) {
                String ft = fileType.toUpperCase();
                if (ft.contains("RULEBOOK")) {
                    category = "RULE_BOOKS";
                    type = "PDF";
                } else if (ft.contains("BROCHURE")) {
                    category = "NOTICES";
                    type = "PDF";
                } else if (ft.contains("GUIDELINE")) {
                    category = "NOTICES";
                    type = "PDF";
                } else if (ft.contains("CIRCULAR")) {
                    category = "CIRCULARS";
                    type = "PDF";
                }
            }

            if (fileName != null && fileName.toLowerCase().endsWith(".docx")) {
                type = "DOCX";
            } else if (fileName != null && fileName.toLowerCase().endsWith(".doc")) {
                type = "DOC";
            }

            String title = t.getTitle() + " - " + (fileType != null ? fileType : "Document");
            String desc = "Official " + (fileType != null ? fileType.toLowerCase() : "document") + " for tournament: " + t.getTitle() + " at " + t.getVenue();

            Download d = new Download();
            d.setTitle(title);
            d.setName(fileName);
            d.setFileName(fileName);
            d.setDescription(desc);
            d.setFileUrl(fileUrl);
            d.setObjectName(objectName);
            d.setSize(1024L * 1024L);
            d.setType(type);
            d.setCategory(category);
            d.setDownloadCount(0);
            d.setFilePath("uploads/tournaments/" + objectName);
            d.setActive(true);

            downloadRepository.save(d);
            log.info("Automatically synced tournament document '{}' to downloads module", fileName);
        } catch (Exception e) {
            log.error("Failed to sync tournament document to downloads module: {}", e.getMessage());
        }
    }
}
