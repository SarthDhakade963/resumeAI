package com.resumeai.service;

import com.resumeai.model.User;

import java.util.Optional;
import java.util.UUID;


public interface UserService {

    public void save(User user);

    Optional<User> findByEmail(String email);

    public User createOAuthUser(String email, String name, String provider, String providerId);

    public Optional<User> validateCredentials(String email, String password);

    public Optional<User> findById(UUID id);
}
