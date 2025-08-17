package com.resumeai.controller;

import com.resumeai.dto.UserDTO;
import com.resumeai.security.JwtUtil;
import com.resumeai.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserProfileController {
    private final UserProfileService userProfileService;  // Use constructor injection (preferred over @Autowired)
    private final JwtUtil jwtUtil;

    // Get profile by id
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable UUID id) {
        UserDTO dto = userProfileService.getUserDTO(id); // service throws if not found
        return ResponseEntity.ok(dto);
    }

    // Update Profile
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUserProfile(@PathVariable UUID id, @RequestBody UserDTO dto) {
        UserDTO updated = userProfileService.updateUser(id, dto);
        return ResponseEntity.ok(updated);
    }

}
