package com.apta.portal.tournament.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tournament_documents")
public class TournamentDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tournament_id", nullable = false)
    private Long tournamentId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public TournamentDocument() {
    }

    public TournamentDocument(Long id, Long tournamentId, String fileName, String filePath, String fileType, LocalDateTime uploadedAt) {
        this.id = id;
        this.tournamentId = tournamentId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileType = fileType;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTournamentId() {
        return this.tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return this.filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return this.fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public LocalDateTime getUploadedAt() {
        return this.uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public static TournamentDocumentBuilder builder() {
        return new TournamentDocumentBuilder();
    }

    public static class TournamentDocumentBuilder {
        private Long id;
        private Long tournamentId;
        private String fileName;
        private String filePath;
        private String fileType;
        private LocalDateTime uploadedAt = LocalDateTime.now();

        public TournamentDocumentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TournamentDocumentBuilder tournamentId(Long tournamentId) {
            this.tournamentId = tournamentId;
            return this;
        }

        public TournamentDocumentBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public TournamentDocumentBuilder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }

        public TournamentDocumentBuilder fileType(String fileType) {
            this.fileType = fileType;
            return this;
        }

        public TournamentDocumentBuilder uploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
            return this;
        }

        public TournamentDocument build() {
            return new TournamentDocument(
                this.id,
                this.tournamentId,
                this.fileName,
                this.filePath,
                this.fileType,
                this.uploadedAt
            );
        }
    }
}
