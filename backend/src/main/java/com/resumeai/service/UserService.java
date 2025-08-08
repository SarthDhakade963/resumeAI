package com.resumeai.service;

import com.resumeai.dto.AuthResponse;
import com.resumeai.dto.SignInRequest;
import com.resumeai.dto.SignUpRequest;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

public interface UserService {
    AuthResponse signup(SignUpRequest request);
    AuthResponse signin(SignInRequest request);
}
