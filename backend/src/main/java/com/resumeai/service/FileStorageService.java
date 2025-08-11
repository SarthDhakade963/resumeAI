package com.resumeai.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


public interface FileStorageService {

    public String saveProfilePic(MultipartFile file) throws IOException;

}
