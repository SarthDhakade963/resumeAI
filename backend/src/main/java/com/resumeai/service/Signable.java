package com.resumeai.service;

import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Base class for all services that need access to the logged-in User.
 */

@RequiredArgsConstructor
public abstract class Signable {
    protected final UserRepository userRepository;

    protected User getLoggedInUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


}
