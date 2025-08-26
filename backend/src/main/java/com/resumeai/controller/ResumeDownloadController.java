package com.resumeai.controller;


import com.resumeai.service.AIResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/user/resumes")
@RequiredArgsConstructor
public class ResumeDownloadController {
    private final AIResumeService aiResumeService;

    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateResume() {
        byte[] pdf = aiResumeService.generatePDF();

          return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
