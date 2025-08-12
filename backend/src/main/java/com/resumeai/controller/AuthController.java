package com.resumeai.controller;

import com.resumeai.dto.AuthResponseDTO;
import com.resumeai.dto.LoginRequestDTO;
import com.resumeai.dto.OAuthLoginRequestDTO;
import com.resumeai.dto.UserDTO;
import com.resumeai.mapper.UserMapper;
import com.resumeai.model.User;
import com.resumeai.security.JwtUtil;
import com.resumeai.service.FileStorageService;
import com.resumeai.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor  // Lombok will generate constructor with required fields (final or @NonNull)
public class AuthController {

    private final UserService userService;  // Use constructor injection (preferred over @Autowired)
    private final JwtUtil jwtUtil;

    @Autowired
    private final FileStorageService fileStorageService;

    // Create a new user
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid  @RequestBody LoginRequestDTO loginReq) {
        return userService.validateCredentials(loginReq.getEmail(), loginReq.getPassword())
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getId(), user.getEmail());
                    return ResponseEntity.ok(UserMapper.toAuthResponse(user, token));
                }
        ).orElse(ResponseEntity.status(401).body(new AuthResponseDTO(null, null, null, null, "Invalid Credentials")));
     }

    @PostMapping("/oauth-login")
    public ResponseEntity<AuthResponseDTO> oauthLogin(@Valid @RequestBody OAuthLoginRequestDTO req) {
        // find or create user
         User user = userService.findByEmail(req.getEmail()).orElseGet(() -> userService.createOAuthUser(
                 req.getEmail(),
                 req.getUsername(),
                 req.getProvider(),
                 req.getProviderID()
         ));

         if(user == null) {
             return ResponseEntity.status(500)
                     .body(new AuthResponseDTO(null, null, null, null, "Unable to create or retrieve user"));
         }

         // Generate Spring JWT
         String token = jwtUtil.generateToken(user.getId(), user.getEmail());

         return ResponseEntity.ok(UserMapper.toAuthResponse(user, token));
     }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        System.out.println("Validating User...");
        try {
            // Extract token from Bearer token header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            System.out.println("Token (validating user) : " + token);

            if (!jwtUtil.validToken(token)) {
                return ResponseEntity.status(401).body("Invalid token or expired to");
            }

            // Extract user ID/email from token claims
            String email = jwtUtil.getEmailFromToken(token);
            System.out.println("User Id : "+ email);

            Optional<User> userOpt = userService.findByEmail(email);
            System.out.println("User Opt : " + userOpt);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }

            User user = userOpt.get();

            // Check profile completion logic
            boolean isProfileComplete = user.isAuthProfileComplete();

            System.out.println();

            return ResponseEntity.ok(Map.of("isProfileComplete", isProfileComplete));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    @GetMapping("/valid")
    public ResponseEntity<?> validProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            String email = jwtUtil.getEmailFromToken(token);
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }

            User user = userOpt.get();

            // Build DTO (prefix base URL for image path)
            String imageUrl = user.getProfilePicUrl();
            if (imageUrl != null && !imageUrl.startsWith("http")) {
                imageUrl = System.getenv("BASE_URL") + imageUrl; // e.g., http://localhost:8080
            }

            UserDTO dto = new UserDTO(
                    user.getUsername(),
                    user.getEmail(),
                    imageUrl,
                    user.isAuthProfileComplete()
            );

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }


    @PostMapping(value = "/profile-setup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestParam("username") String username,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            System.out.println("Updating Profile...");
            System.out.println("Username: " + username);
            System.out.println("File: " + profilePic);

            String token = authHeader.substring(7);
            if (!jwtUtil.validToken(token)) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            String email = jwtUtil.getEmailFromToken(token);

            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOpt.get();

            user.setUsername(username);

            if (profilePic != null && !profilePic.isEmpty()) {
                String profilePicUrl = fileStorageService.saveProfilePic(profilePic);
                System.out.println("Profile Pic URL: " + profilePicUrl);
                user.setProfilePicUrl(profilePicUrl);
            }

            user.setAuthProfileComplete(true);

            System.out.println("Profile before saving : " + user);

            userService.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile setup complete",
                    "username", user.getUsername(),
                    "profilePicUrl", user.getProfilePicUrl()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

}
