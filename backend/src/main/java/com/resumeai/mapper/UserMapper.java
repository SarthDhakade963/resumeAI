package com.resumeai.mapper;

import com.resumeai.dto.UserDTO;
import com.resumeai.dto.authDTO.AuthResponseDTO;
import com.resumeai.model.User;

import java.util.Optional;

public class UserMapper {
    public static AuthResponseDTO toAuthResponse(User user, String token) {
        return new AuthResponseDTO(
                user.getId(),
                user.getEmail(),
                token,
                null // success, no error
        );
    }

    public static UserDTO toDTO(User user) {
        return UserDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .profilePicUrl(user.getProfilePicUrl())
                .fullName(user.getFullName())
                .summary(user.getSummary())
                .build();
    }
}