package com.resumeai.dto.authDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private UUID id;
    private String email;
    private String accessToken;
    private String error;
}
