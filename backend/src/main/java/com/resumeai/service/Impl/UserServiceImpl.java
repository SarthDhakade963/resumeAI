package com.resumeai.service.Impl;

import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import com.resumeai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void save(User user) {
        userRepository.save(user);
    }


    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User createOAuthUser(String email, String name, String provider, String providerId) {
        User user = User.builder()
                .email(email)
                .username(name != null ? name : email) // fallback
                .password(null) // no password for OAuth
                .isProfileComplete(false)
                .build();
        return userRepository.save(user);
    }

    @Override
    public Optional<User> validateCredentials(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        System.out.println(userOpt);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword() != null && passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            } else {
                return Optional.empty(); // password mismatch
            }
        } else {
            // User not found, auto-create user (sign-up)
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(password));

            System.out.println(newUser);

            userRepository.save(newUser);
            return Optional.of(newUser);
        }
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }



}
