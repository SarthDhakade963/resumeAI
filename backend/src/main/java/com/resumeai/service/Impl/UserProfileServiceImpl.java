package com.resumeai.service.Impl;

import com.resumeai.dto.UserDTO;
import com.resumeai.mapper.UserMapper;
import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import com.resumeai.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private UserRepository userRepository;

    @Override
    public UserDTO getUserDTO(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found for user ID: " + id));

        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO updateUser(UUID id, UserDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Profile not found for user ID: " + id));

        user.setUsername(dto.getUsername());

        user.setEmail(dto.getEmail());

        user.setProfilePicUrl(dto.getProfilePicUrl());

        User savedUser = userRepository.save(user);

        return UserMapper.toDTO(savedUser);
    }
}
