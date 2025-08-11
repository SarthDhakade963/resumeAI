package com.resumeai.mapper;

import com.resumeai.dto.AuthResponseDTO;
import com.resumeai.dto.OAuthLoginRequestDTO;
import com.resumeai.model.User;

public class UserMapper {
    public static AuthResponseDTO toAuthResponse(User user, String token) {
        return new AuthResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                token,
                null // success, no error
        );
    }
}