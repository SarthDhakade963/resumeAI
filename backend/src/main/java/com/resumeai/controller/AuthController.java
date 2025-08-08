package com.resumeai.controller;

import com.resumeai.dto.AuthResponse;
import com.resumeai.dto.SignInRequest;
import com.resumeai.dto.SignUpRequest;
import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import com.resumeai.security.jwt.JwtService;
import com.resumeai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request) {
        System.out.println("✅ Hit /signup controller");
        return ResponseEntity.ok(userService.signup(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(userService.signin(request));
    }

}
