package com.apta.portal.gallery.entity;

import com.apta.portal.common.entity.BaseEntity;
import com.apta.portal.tournament.entity.Tournament;
import com.apta.portal.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gallery_items")
public class GalleryItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Size(max = 15)
    @Column(name = "media_type", nullable = false, length = 15)
    private String mediaType; // IMAGE or VIDEO

    @NotBlank
    @Size(max = 512)
    @Column(name = "media_url", nullable = false, length = 512)
    private String mediaUrl;

    @Size(max = 512)
    @Column(name = "thumbnail_url", length = 512)
    private String thumbnailUrl;

    @NotBlank
    @Size(max = 30)
    @Column(name = "gallery_type", nullable = false, length = 30)
    private String galleryType; // "PHOTO" or "VIDEO" or "GENERAL"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    public GalleryItem() {
    }

    public GalleryItem(Long id, String title, String description, String mediaType, String mediaUrl, String thumbnailUrl, String galleryType, Tournament tournament, User createdBy, Boolean isFeatured) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.mediaType = mediaType;
        this.mediaUrl = mediaUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.galleryType = galleryType;
        this.tournament = tournament;
        this.createdBy = createdBy;
        this.isFeatured = isFeatured;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getMediaType() {
        return this.mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getMediaUrl() {
        return this.mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getThumbnailUrl() {
        return this.thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getGalleryType() {
        return this.galleryType;
    }

    public void setGalleryType(String galleryType) {
        this.galleryType = galleryType;
    }

    public Tournament getTournament() {
        return this.tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public User getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Boolean getIsFeatured() {
        return this.isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public static GalleryItemBuilder builder() {
        return new GalleryItemBuilder();
    }

    public static class GalleryItemBuilder {
        private Long id;
        private String title;
        private String description;
        private String mediaType;
        private String mediaUrl;
        private String thumbnailUrl;
        private String galleryType;
        private Tournament tournament;
        private User createdBy;
        private Boolean isFeatured = false;

        public GalleryItemBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public GalleryItemBuilder title(String title) {
            this.title = title;
            return this;
        }

        public GalleryItemBuilder description(String description) {
            this.description = description;
            return this;
        }

        public GalleryItemBuilder mediaType(String mediaType) {
            this.mediaType = mediaType;
            return this;
        }

        public GalleryItemBuilder mediaUrl(String mediaUrl) {
            this.mediaUrl = mediaUrl;
            return this;
        }

        public GalleryItemBuilder thumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
            return this;
        }

        public GalleryItemBuilder galleryType(String galleryType) {
            this.galleryType = galleryType;
            return this;
        }

        public GalleryItemBuilder tournament(Tournament tournament) {
            this.tournament = tournament;
            return this;
        }

        public GalleryItemBuilder createdBy(User createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public GalleryItemBuilder isFeatured(Boolean isFeatured) {
            this.isFeatured = isFeatured;
            return this;
        }

        public GalleryItem build() {
            return new GalleryItem(
                this.id,
                this.title,
                this.description,
                this.mediaType,
                this.mediaUrl,
                this.thumbnailUrl,
                this.galleryType,
                this.tournament,
                this.createdBy,
                this.isFeatured
            );
        }
    }
}
