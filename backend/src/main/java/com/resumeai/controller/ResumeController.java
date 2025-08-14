package com.resumeai.controller;


import com.resumeai.dto.ResumeDTO;
import com.resumeai.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user/resumes")
public class ResumeController {
    private ResumeService resumeService;

    @GetMapping
    public ResponseEntity<ResumeDTO> getResume() {
        return ResponseEntity.ok(resumeService.generateResume());
    }
}
