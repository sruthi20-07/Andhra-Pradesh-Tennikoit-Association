package com.apta.portal.common.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private com.apta.portal.download.repository.DownloadRepository downloadRepository;

    private static final String BASE_UPLOAD_DIR = "uploads/";

    public FileController() {
        createDir("uploads/");
        createDir("uploads/players/");
        createDir("uploads/tournaments/");
        createDir("uploads/downloads/");
        createDir("uploads/gallery/");
        createDir("uploads/documents/");
    }

    private void createDir(String path) {
        File dir = new File(path);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    private String resolveTargetFolder(String folder) {
        if (folder == null) return "documents";
        String clean = folder.trim().toLowerCase();
        if (clean.equals("profile-photos") || clean.equals("players")) {
            return "players";
        }
        if (clean.equals("circulars") || clean.equals("downloads")) {
            return "downloads";
        }
        if (clean.equals("gallery")) {
            return "gallery";
        }
        if (clean.equals("tournaments")) {
            return "tournaments";
        }
        if (clean.equals("documents")) {
            return "documents";
        }
        return clean;
    }

    @GetMapping("/upload-url")
    public ResponseEntity<Map<String, Object>> getUploadUrl(
            @RequestParam String filename,
            @RequestParam String contentType,
            @RequestParam(required = false) String folder) {
        
        String cleanFolder = folder != null ? folder.trim().toLowerCase() : "profile-photos";
        String objectName = UUID.randomUUID().toString() + "_" + filename;
        
        // Build upload URL with the port 8082
        String uploadUrl = "http://localhost:8082/api/files/upload?objectName=" + objectName + "&folder=" + cleanFolder;
        
        Map<String, Object> response = new HashMap<>();
        response.put("url", uploadUrl);
        response.put("objectName", objectName);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam String objectName,
            @RequestParam(required = false, defaultValue = "profile-photos") String folder,
            HttpServletRequest request) {
        
        String resolvedFolder = resolveTargetFolder(folder);
        String targetDir = BASE_UPLOAD_DIR + resolvedFolder + "/";
        createDir(targetDir);

        File file = new File(targetDir + objectName);
        boolean success = false;
        try (InputStream is = request.getInputStream();
             FileOutputStream fos = new FileOutputStream(file)) {
            
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = is.read(buffer)) != -1) {
                fos.write(buffer, 0, bytesRead);
            }
            success = true;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        if (success && ("gallery".equalsIgnoreCase(resolvedFolder) || "players".equalsIgnoreCase(resolvedFolder))) {
            generateThumbnail(file, objectName);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("objectName", objectName);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFilePost(
            @RequestParam(required = false) String objectName,
            @RequestParam(required = false, defaultValue = "profile-photos") String folder,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile multipartFile,
            HttpServletRequest request) {
        
        String targetObjectName = objectName;
        String resolvedFolder = resolveTargetFolder(folder);
        String targetDir = BASE_UPLOAD_DIR + resolvedFolder + "/";
        createDir(targetDir);

        if (multipartFile != null && !multipartFile.isEmpty()) {
            if (targetObjectName == null || targetObjectName.trim().isEmpty()) {
                targetObjectName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
            }
            File file = new File(targetDir + targetObjectName);
            try {
                multipartFile.transferTo(file);
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } else {
            // Raw binary stream upload via POST
            if (targetObjectName == null || targetObjectName.trim().isEmpty()) {
                targetObjectName = UUID.randomUUID().toString() + "_uploaded_file";
            }
            File file = new File(targetDir + targetObjectName);
            try (InputStream is = request.getInputStream();
                 FileOutputStream fos = new FileOutputStream(file)) {
                
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    fos.write(buffer, 0, bytesRead);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        if ("gallery".equalsIgnoreCase(resolvedFolder) || "players".equalsIgnoreCase(resolvedFolder)) {
            File file = new File(targetDir + targetObjectName);
            generateThumbnail(file, targetObjectName);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("objectName", targetObjectName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download-url")
    public ResponseEntity<Map<String, Object>> getDownloadUrl(@RequestParam String objectName) {
        String downloadUrl = "http://localhost:8082/api/files/download?objectName=" + objectName;
        Map<String, Object> response = new HashMap<>();
        response.put("url", downloadUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam String objectName) {
        // Search in all folders
        File file = new File("uploads/profile-photos/" + objectName);
        if (!file.exists()) {
            file = new File("uploads/gallery/" + objectName);
        }
        if (!file.exists()) {
            file = new File("uploads/tournaments/" + objectName);
        }
        if (!file.exists()) {
            file = new File("uploads/documents/" + objectName);
        }
        if (!file.exists()) {
            file = new File("uploads/circulars/" + objectName);
        }
        if (!file.exists()) {
            file = new File("src/main/resources/static/" + objectName);
        }
        
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = "application/octet-stream";
        
        if (objectName.toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf";
        } else if (objectName.toLowerCase().endsWith(".jpg") || objectName.toLowerCase().endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (objectName.toLowerCase().endsWith(".png")) {
            contentType = "image/png";
        } else if (objectName.toLowerCase().endsWith(".docx")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (objectName.toLowerCase().endsWith(".doc")) {
            contentType = "application/msword";
        }

        String contentDisposition = "attachment; filename=\"" + URLEncoder.encode(file.getName(), StandardCharsets.UTF_8) + "\"";
        if (objectName.toLowerCase().endsWith(".pdf") || 
            objectName.toLowerCase().endsWith(".png") || 
            objectName.toLowerCase().endsWith(".jpg") || 
            objectName.toLowerCase().endsWith(".jpeg")) {
            contentDisposition = "inline; filename=\"" + URLEncoder.encode(file.getName(), StandardCharsets.UTF_8) + "\"";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(file.length())
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }

    private void generateThumbnail(File originalFile, String objectName) {
        try {
            String nameLower = originalFile.getName().toLowerCase();
            if (nameLower.endsWith(".jpg") || nameLower.endsWith(".jpeg") || nameLower.endsWith(".png")) {
                java.awt.image.BufferedImage img = javax.imageio.ImageIO.read(originalFile);
                if (img != null) {
                    int type = img.getType() == 0 ? java.awt.image.BufferedImage.TYPE_INT_ARGB : img.getType();
                    
                    int targetWidth = 200;
                    double scale = (double) targetWidth / img.getWidth();
                    int targetHeight = (int) (img.getHeight() * scale);
                    
                    java.awt.image.BufferedImage resized = new java.awt.image.BufferedImage(targetWidth, targetHeight, type);
                    java.awt.Graphics2D g = resized.createGraphics();
                    g.drawImage(img, 0, 0, targetWidth, targetHeight, null);
                    g.dispose();
                    
                    createDir("uploads/thumbnails/");
                    File thumbFile = new File("uploads/thumbnails/" + objectName);
                    
                    String format = "jpg";
                    if (nameLower.endsWith(".png")) {
                        format = "png";
                    }
                    javax.imageio.ImageIO.write(resized, format, thumbFile);
                    System.out.println("Thumbnail generated for: " + objectName);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to generate thumbnail for: " + objectName + " error: " + e.getMessage());
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> viewPdfFile(@PathVariable Long id) {
        com.apta.portal.download.entity.Download download = downloadRepository.findById(id)
                .orElseThrow(() -> new com.apta.portal.exception.ResourceNotFoundException("File not found"));

        String filename = null;
        if (download.getObjectName() != null && !download.getObjectName().trim().isEmpty()) {
            filename = download.getObjectName();
        } else if (download.getFileUrl() != null) {
            if (download.getFileUrl().contains("objectName=")) {
                int index = download.getFileUrl().indexOf("objectName=");
                filename = download.getFileUrl().substring(index + "objectName=".length());
                if (filename.contains("&")) {
                    filename = filename.substring(0, filename.indexOf("&"));
                }
            } else {
                filename = download.getFileUrl().substring(download.getFileUrl().lastIndexOf("/") + 1);
            }
        }

        File file = null;
        if (download.getFilePath() != null) {
            file = new File(download.getFilePath());
        }
        if ((file == null || !file.exists()) && filename != null) {
            String[] searchDirs = {
                "uploads/downloads/",
                "uploads/documents/",
                "uploads/tournaments/",
                "uploads/circulars/",
                "uploads/gallery/",
                "uploads/profile-photos/",
                "src/main/resources/static/"
            };
            for (String dir : searchDirs) {
                File tempFile = new File(dir + filename);
                if (tempFile.exists()) {
                    file = tempFile;
                    break;
                }
            }
        }

        if (file == null || !file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = "application/octet-stream";
        if (file.getName().toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf";
        } else if (file.getName().toLowerCase().endsWith(".jpg") || file.getName().toLowerCase().endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (file.getName().toLowerCase().endsWith(".png")) {
            contentType = "image/png";
        } else if (file.getName().toLowerCase().endsWith(".docx")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (file.getName().toLowerCase().endsWith(".doc")) {
            contentType = "application/msword";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFileById(@PathVariable Long id) {
        com.apta.portal.download.entity.Download download = downloadRepository.findById(id)
                .orElseThrow(() -> new com.apta.portal.exception.ResourceNotFoundException("File not found"));

        String filename = null;
        if (download.getObjectName() != null && !download.getObjectName().trim().isEmpty()) {
            filename = download.getObjectName();
        } else if (download.getFileUrl() != null) {
            if (download.getFileUrl().contains("objectName=")) {
                int index = download.getFileUrl().indexOf("objectName=");
                filename = download.getFileUrl().substring(index + "objectName=".length());
                if (filename.contains("&")) {
                    filename = filename.substring(0, filename.indexOf("&"));
                }
            } else {
                filename = download.getFileUrl().substring(download.getFileUrl().lastIndexOf("/") + 1);
            }
        }

        File file = null;
        if (download.getFilePath() != null) {
            file = new File(download.getFilePath());
        }
        if ((file == null || !file.exists()) && filename != null) {
            String[] searchDirs = {
                "uploads/downloads/",
                "uploads/documents/",
                "uploads/tournaments/",
                "uploads/circulars/",
                "uploads/gallery/",
                "uploads/profile-photos/",
                "src/main/resources/static/"
            };
            for (String dir : searchDirs) {
                File tempFile = new File(dir + filename);
                if (tempFile.exists()) {
                    file = tempFile;
                    break;
                }
            }
        }

        if (file == null || !file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = "application/octet-stream";
        if (file.getName().toLowerCase().endsWith(".pdf")) {
            contentType = "application/pdf";
        } else if (file.getName().toLowerCase().endsWith(".jpg") || file.getName().toLowerCase().endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (file.getName().toLowerCase().endsWith(".png")) {
            contentType = "image/png";
        } else if (file.getName().toLowerCase().endsWith(".docx")) {
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (file.getName().toLowerCase().endsWith(".doc")) {
            contentType = "application/msword";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
}
