package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private UUID id;
    private String email;
    private String username;
    private String accessToken;
    private String error;
}
