package com.resumeai.service.Impl;

import com.resumeai.service.FileStorageService;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path uploadDir;

    public FileStorageServiceImpl() throws IOException {
        // Save in user home directory (cross-platform)
        this.uploadDir = Paths.get(System.getProperty("user.home"), "resumai", "uploads", "profile-pics");

        if(!Files.exists(uploadDir)) {
            // Ensure directories exist
            Files.createDirectories(uploadDir);
        }
    }

    @Override
    public String saveProfilePic(MultipartFile file) throws IOException {
        // Validate and get extension
        String extension = getExtension(file);

        // Create safe unique filename
        String safeName = UUID.randomUUID() + extension;

        // Target path
        Path targetPath = uploadDir.resolve(safeName).normalize();

        // Save the file to path C:\Users\sarth\resumai\\uploads\profile-pics\
        file.transferTo(targetPath.toFile());

        // Return relative URL for serving
        return "/uploads/profile-pics/" + safeName;
    }

    private static @NotNull String getExtension(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("Invalid file type");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Default fallback if no extension
        return ".png";
    }


}
