package com.apta.portal.gallery.controller;

import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.gallery.entity.GalleryItem;
import com.apta.portal.gallery.repository.GalleryItemRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class GalleryController {

    private static final Logger log = LoggerFactory.getLogger(GalleryController.class);

    @Autowired
    private GalleryItemRepository galleryRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    private Map<String, Object> mapToResponse(GalleryItem item) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", item.getId());
        map.put("title", item.getTitle());
        map.put("description", item.getDescription());
        map.put("type", item.getMediaType());
        map.put("galleryType", item.getGalleryType());
        
        String mediaUrl = item.getMediaUrl();
        if (mediaUrl.startsWith("http")) {
            map.put("url", mediaUrl);
        } else if (mediaUrl.startsWith("/api/files/download")) {
            String objectName = mediaUrl.contains("objectName=") ? mediaUrl.split("objectName=")[1] : mediaUrl;
            map.put("url", "http://localhost:8082/uploads/gallery/" + objectName);
        } else if (mediaUrl.startsWith("/uploads/")) {
            map.put("url", "http://localhost:8082" + mediaUrl);
        } else {
            map.put("url", "http://localhost:8082/uploads/gallery/" + mediaUrl);
        }
        return map;
    }

    @GetMapping("/api/gallery")
    public ResponseEntity<List<Map<String, Object>>> getGallery(@RequestParam(required = false) String type) {
        List<GalleryItem> items;
        if (type != null && !type.isEmpty()) {
            items = galleryRepository.findByMediaType(type.toUpperCase());
        } else {
            items = galleryRepository.findAll();
        }

        List<Map<String, Object>> responses = items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/api/gallery/upload")
    public ResponseEntity<?> uploadGalleryItem(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "galleryType", required = false, defaultValue = "GENERAL") String galleryType) {
        try {
            String targetDir = "uploads/gallery/";
            File dir = new File(targetDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalName = file.getOriginalFilename();
            String targetObjectName = java.util.UUID.randomUUID().toString() + "_" + (originalName != null ? originalName : "media");
            File targetFile = new File(targetDir + targetObjectName);
            file.transferTo(targetFile);

            String mediaType = "IMAGE";
            if (file.getContentType() != null && file.getContentType().startsWith("video")) {
                mediaType = "VIDEO";
            } else if (originalName != null) {
                String nameLower = originalName.toLowerCase();
                if (nameLower.endsWith(".mp4") || nameLower.endsWith(".avi") || nameLower.endsWith(".mov") || nameLower.endsWith(".mkv") || nameLower.endsWith(".webm")) {
                    mediaType = "VIDEO";
                }
            }

            GalleryItem item = new GalleryItem();
            item.setTitle(title != null && !title.trim().isEmpty() ? title : (originalName != null ? originalName : "Uploaded Media"));
            item.setDescription(description != null ? description : item.getTitle());
            item.setMediaType(mediaType);
            item.setGalleryType(galleryType.toUpperCase());
            
            String downloadUrl = "http://localhost:8082/api/files/download?objectName=" + targetObjectName;
            item.setMediaUrl(downloadUrl);
            item.setThumbnailUrl(downloadUrl);

            User user = getAuthenticatedUser();
            item.setCreatedBy(user);

            GalleryItem saved = galleryRepository.save(item);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "url", downloadUrl,
                "data", mapToResponse(saved)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/api/admin/gallery")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createGalleryItemJson(@RequestBody Map<String, Object> req) {
        String title = (String) req.get("title");
        String type = (String) req.get("type");
        String url = (String) req.get("url");
        String galleryType = (String) req.get("galleryType");
        String description = (String) req.get("description");

        GalleryItem item = new GalleryItem();
        item.setTitle(title);
        item.setDescription(description != null ? description : title);
        item.setGalleryType(galleryType != null ? galleryType.toUpperCase() : "GENERAL");
        item.setMediaType(type != null ? type.toUpperCase() : "IMAGE");
        
        if (url != null && !url.trim().isEmpty()) {
            if (url.startsWith("http") || url.startsWith("/uploads/") || url.startsWith("/api/files/download")) {
                item.setMediaUrl(url);
                item.setThumbnailUrl(url);
            } else {
                item.setMediaUrl("/api/files/download?objectName=" + url);
                item.setThumbnailUrl("/api/files/download?objectName=" + url);
            }
        } else {
            item.setMediaUrl("");
            item.setThumbnailUrl("");
        }

        User user = getAuthenticatedUser();
        item.setCreatedBy(user);

        GalleryItem saved = galleryRepository.save(item);

        return ResponseEntity.status(201).body(Map.of("success", true, "data", mapToResponse(saved)));
    }

    @PutMapping("/api/admin/gallery/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateGalleryItem(
            @PathVariable Long id,
            @RequestBody Map<String, Object> req) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with ID " + id));
        
        String title = (String) req.get("title");
        String type = (String) req.get("type");
        String url = (String) req.get("url");
        String galleryType = (String) req.get("galleryType");
        String description = (String) req.get("description");

        if (title != null) {
            item.setTitle(title);
        }
        if (description != null) {
            item.setDescription(description);
        }
        if (type != null) {
            item.setMediaType(type.toUpperCase());
        }
        if (galleryType != null) {
            item.setGalleryType(galleryType.toUpperCase());
        }
        if (url != null && !url.trim().isEmpty()) {
            if (url.startsWith("http") || url.startsWith("/uploads/") || url.startsWith("/api/files/download")) {
                item.setMediaUrl(url);
                item.setThumbnailUrl(url);
            } else {
                item.setMediaUrl("/api/files/download?objectName=" + url);
                item.setThumbnailUrl("/api/files/download?objectName=" + url);
            }
        }

        GalleryItem saved = galleryRepository.save(item);
        return ResponseEntity.ok(Map.of("success", true, "data", mapToResponse(saved)));
    }

    @DeleteMapping("/api/admin/gallery/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteGalleryItem(@PathVariable Long id) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found with ID " + id));
        galleryRepository.delete(item);
        return ResponseEntity.ok(Map.of("success", true, "message", "Gallery item deleted successfully"));
    }
}
