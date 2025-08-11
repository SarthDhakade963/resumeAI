package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String username;
    private String email;
    private String profilePicUrl; // URL
    private boolean isProfileComplete;
}
