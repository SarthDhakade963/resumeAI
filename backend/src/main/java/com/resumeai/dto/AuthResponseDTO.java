package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private long id;
    private String email;
    private String username;
    private String accessToken;
    private String error;
}
