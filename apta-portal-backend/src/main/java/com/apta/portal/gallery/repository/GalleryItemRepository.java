package com.apta.portal.gallery.repository;

import com.apta.portal.gallery.entity.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
    List<GalleryItem> findByMediaType(String mediaType);
    List<GalleryItem> findByGalleryType(String galleryType);
}
