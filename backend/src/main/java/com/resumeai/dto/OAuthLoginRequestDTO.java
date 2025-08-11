package com.resumeai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OAuthLoginRequestDTO {
    @Email
    @NotBlank
    private String email;
    
    private String username;
    @NotBlank
    private String provider;
    @NotBlank
    private String providerID;
}
