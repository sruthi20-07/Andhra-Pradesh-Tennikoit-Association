package com.apta.portal.download.controller;

import com.apta.portal.download.entity.Download;
import com.apta.portal.download.repository.DownloadRepository;
import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.storage.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/downloads")
public class DownloadController {

    @Autowired
    private DownloadRepository downloadRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private Map<String, Object> mapToResponse(Download doc) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", doc.getId());
        map.put("name", doc.getName() != null ? doc.getName() : doc.getTitle());
        
        // Format size to human readable
        String formattedSize = "1.0 MB";
        if (doc.getSize() != null) {
            long bytes = doc.getSize();
            if (bytes >= 1024 * 1024) {
                formattedSize = String.format("%.1f MB", (double) bytes / (1024 * 1024));
            } else if (bytes >= 1024) {
                formattedSize = String.format("%d KB", bytes / 1024);
            } else {
                formattedSize = bytes + " B";
            }
        }
        
        map.put("size", formattedSize);
        map.put("type", doc.getType() != null ? doc.getType() : "PDF");
        map.put("objectName", doc.getObjectName() != null ? doc.getObjectName() : "referee_circular.pdf");
        map.put("description", doc.getDescription());
        map.put("category", doc.getCategory());
        map.put("fileUrl", doc.getFileUrl());
        map.put("downloadCount", doc.getDownloadCount());
        map.put("fileName", doc.getFileName() != null ? doc.getFileName() : doc.getName());
        map.put("filePath", doc.getFilePath() != null ? doc.getFilePath() : doc.getFileUrl());
        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getDownloads() {
        List<Download> list = downloadRepository.findAll();
        List<Map<String, Object>> responses = list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createDownloadJson(@RequestBody Map<String, Object> req) {
        String name = (String) req.get("name");
        String description = (String) req.get("description");
        String category = (String) req.get("category");
        String objectName = (String) req.get("objectName");
        String type = (String) req.get("type");
        String sizeStr = (String) req.get("size");

        long sizeBytes = 1024 * 1024;
        if (sizeStr != null && !sizeStr.trim().isEmpty()) {
            try {
                String clean = sizeStr.toLowerCase().replaceAll("[^0-9.]", "").trim();
                double val = Double.parseDouble(clean);
                if (sizeStr.toLowerCase().contains("gb")) {
                    sizeBytes = (long) (val * 1024 * 1024 * 1024);
                } else if (sizeStr.toLowerCase().contains("mb")) {
                    sizeBytes = (long) (val * 1024 * 1024);
                } else if (sizeStr.toLowerCase().contains("kb")) {
                    sizeBytes = (long) (val * 1024);
                } else {
                    sizeBytes = (long) val;
                }
            } catch (Exception e) {
                // ignore and use default
            }
        }

        String fileUrl = "/api/files/download?objectName=" + objectName;

        Download download = new Download();
        download.setTitle(name != null ? name : "Untitled Document");
        download.setName(name);
        download.setDescription(description);
        download.setFileUrl(fileUrl);
        download.setObjectName(objectName);
        download.setSize(sizeBytes);
        download.setType(type != null ? type.toUpperCase() : "PDF");
        download.setCategory(category != null ? category.toUpperCase() : "CIRCULARS");
        download.setDownloadCount(0);
        
        Download saved = downloadRepository.save(download);
        return ResponseEntity.status(201).body(Map.of("success", true, "data", mapToResponse(saved)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", defaultValue = "GENERAL") String category) {

        String fileUrl = fileStorageService.storeFile(file, "downloads");
        String originalFilename = file.getOriginalFilename();
        String filenameOnDisk = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        String relativePath = "uploads/downloads/" + filenameOnDisk;

        Download download = new Download();
        download.setTitle(title);
        download.setName(originalFilename);
        download.setDescription(description);
        download.setFileUrl(fileUrl);
        download.setSize(file.getSize());
        download.setType(originalFilename != null &&
                originalFilename.toLowerCase().endsWith(".pdf") ? "PDF" : "DOC");
        download.setCategory(category.toUpperCase());
        download.setDownloadCount(0);
        download.setFileName(originalFilename);
        download.setFilePath(relativePath);
        Download saved = downloadRepository.save(download);

        return ResponseEntity.status(201).body(Map.of("success", true, "data", mapToResponse(saved)));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Download download = downloadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        download.setDownloadCount(download.getDownloadCount() + 1);
        downloadRepository.save(download);

        // If URL is external (starts with http), redirect or resolve
        if (download.getFileUrl().startsWith("http")) {
            return ResponseEntity.status(302)
                    .header(HttpHeaders.LOCATION, download.getFileUrl())
                    .build();
        }

        // Serve local file
        Path filePath = Paths.get(download.getFileUrl());
        Resource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + download.getName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDownload(@PathVariable Long id) {
        Download doc = downloadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + id));
        downloadRepository.delete(doc);
        return ResponseEntity.ok().build();
    }
}
