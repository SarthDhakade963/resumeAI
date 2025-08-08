package com.resumeai.service.Impl;

import com.resumeai.dto.AuthResponse;
import com.resumeai.dto.SignInRequest;
import com.resumeai.dto.SignUpRequest;
import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import com.resumeai.security.jwt.JwtService;
import com.resumeai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public AuthResponse signup(SignUpRequest request) {

        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }

        if(userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already registered.");
        }

        User user = new User();

        user.setEmail(request.getEmail());

        user.setUsername(request.getUsername());

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);

        userRepository.save(user);
        
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse signin(SignInRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Credentials /userServiceImpl");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }
}
