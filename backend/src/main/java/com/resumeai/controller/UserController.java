package com.resumeai.controller;

import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping
    public ResponseEntity<User> getUsername(@RequestBody User user) {
        return ResponseEntity.ok(userRepository.getReferenceById(Long.valueOf(user.username)));
    }

}
