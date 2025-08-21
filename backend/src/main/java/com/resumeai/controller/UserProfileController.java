package com.resumeai.controller;

import com.resumeai.dto.UserDTO;
import com.resumeai.model.User;
import com.resumeai.security.JwtUtil;
import com.resumeai.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.io.Resource;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserProfileController {
    private final UserProfileService userProfileService;  // Use constructor injection (preferred over @Autowired)
    private final JwtUtil jwtUtil;

    // Get profile by id
    @GetMapping
    public ResponseEntity<UserDTO> getUserProfile() {
        UserDTO dto = userProfileService.getUserDTO(); // service throws if not found
        return ResponseEntity.ok(dto);
    }

    // Update Profile
    @PutMapping()
    public ResponseEntity<UserDTO> updateUserProfile(@RequestBody UserDTO dto) {
        UserDTO updated = userProfileService.updateUser(dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userProfileService.currentUser());
    }

    @GetMapping("/check-profile")
    public ResponseEntity<Map<String, Boolean>> checkProfile() {
        boolean completed = userProfileService.calculateProfileCompleted();
        return ResponseEntity.ok(Collections.singletonMap("profileCompleted", completed));
    }

    @GetMapping("/profile-pic")
    public ResponseEntity<org.springframework.core.io.Resource> getProfilePic() throws IOException {
        Resource resource = userProfileService.getProfilePic();
        System.out.println("Resource" + resource);
        Path path = Paths.get(resource.getFile().getAbsolutePath());
        System.out.println("Path" + path);
        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
