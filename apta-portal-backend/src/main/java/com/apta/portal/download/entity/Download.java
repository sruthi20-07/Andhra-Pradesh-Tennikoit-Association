package com.apta.portal.download.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "downloads")
public class Download extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "size")
    private Long size;

    @Column(name = "type")
    private String type; // "CIRCULAR", "BROCHURE", "RULEBOOK"
    private String objectName;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Size(max = 512)
    @Column(name = "file_url", nullable = false, length = 512)
    private String fileUrl;

    @NotBlank
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String category; // FORMS, RULE_BOOKS, CIRCULARS, NOTICES

    @NotNull
    @Min(0)
    @Column(name = "download_count", nullable = false)
    private Integer downloadCount = 0;

    @NotNull
    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    private String filePath;

    public Download() {
    }

    public Download(Long id, String name, Long size, String type, String objectName, String title, String description, String fileUrl, String category, Integer downloadCount, Boolean active, User createdBy) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.type = type;
        this.objectName = objectName;
        this.title = title;
        this.description = description;
        this.fileUrl = fileUrl;
        this.category = category;
        this.downloadCount = downloadCount;
        this.active = active;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSize() {
        return this.size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getObjectName() {
        return this.objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileUrl() {
        return this.fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getDownloadCount() {
        return this.downloadCount;
    }

    public void setDownloadCount(Integer downloadCount) {
        this.downloadCount = downloadCount;
    }

    public Boolean getActive() {
        return this.active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public User getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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

    public static DownloadBuilder builder() {
        return new DownloadBuilder();
    }

    public static class DownloadBuilder {
        private Long id;
        private String name;
        private Long size;
        private String type;
        private String objectName;
        private String title;
        private String description;
        private String fileUrl;
        private String category;
        private Integer downloadCount = 0;
        private Boolean active = true;
        private User createdBy;
        private String fileName;
        private String filePath;

        public DownloadBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DownloadBuilder name(String name) {
            this.name = name;
            return this;
        }

        public DownloadBuilder size(Long size) {
            this.size = size;
            return this;
        }

        public DownloadBuilder type(String type) {
            this.type = type;
            return this;
        }

        public DownloadBuilder objectName(String objectName) {
            this.objectName = objectName;
            return this;
        }

        public DownloadBuilder title(String title) {
            this.title = title;
            return this;
        }

        public DownloadBuilder description(String description) {
            this.description = description;
            return this;
        }

        public DownloadBuilder fileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
            return this;
        }

        public DownloadBuilder category(String category) {
            this.category = category;
            return this;
        }

        public DownloadBuilder downloadCount(Integer downloadCount) {
            this.downloadCount = downloadCount;
            return this;
        }

        public DownloadBuilder active(Boolean active) {
            this.active = active;
            return this;
        }

        public DownloadBuilder createdBy(User createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public DownloadBuilder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public DownloadBuilder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }

        public Download build() {
            Download d = new Download(
                this.id,
                this.name,
                this.size,
                this.type,
                this.objectName,
                this.title,
                this.description,
                this.fileUrl,
                this.category,
                this.downloadCount,
                this.active,
                this.createdBy
            );
            d.setFileName(this.fileName);
            d.setFilePath(this.filePath);
            return d;
        }
    }
}
