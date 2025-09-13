package com.resumeai.controller;

import com.resumeai.dto.Resume;
import com.resumeai.service.AIResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ResumeViewController {

    private final AIResumeService aiResumeService;

    @PostMapping("/user/resumes/save")
    public ResponseEntity<String> saveEditedResume(@RequestBody Resume resume) {
        return ResponseEntity.ok(aiResumeService.saveResume(resume));
    }

    @GetMapping("/user/resumes/data")
    public ResponseEntity<Resume> getResumeDataForFrontend() {
        return ResponseEntity.ok(aiResumeService.sendResume()); // <-- sends JSON to frontend
    }

    @PostMapping("/user/resumes/preview")
    public ResponseEntity<String> previewResume() {
        try {
            return ResponseEntity.ok(aiResumeService.previewResume());
        } catch (Exception e) {
            // If Thymeleaf fails, send 400 so frontend can return to edit page
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Preview generation failed: " + e.getMessage());
        }
    }

}
