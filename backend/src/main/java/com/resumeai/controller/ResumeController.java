package com.resumeai.controller;


import com.resumeai.dto.ResumeDTO;
import com.resumeai.model.Resume;
import com.resumeai.model.User;
import com.resumeai.service.AIResumeService;
import com.resumeai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final AIResumeService aiResumeService;

    @GetMapping
    public ResponseEntity<ResumeDTO> getResume() {
        return ResponseEntity.ok(aiResumeService.getResumeData());
    }

    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateResume() {
        byte[] pdf = aiResumeService.generateResume();

          return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
