package com.resumeai.controller;

import com.resumeai.dto.Resume;
import com.resumeai.dto.ResumeDTO;
import com.resumeai.service.AIResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class ResumeViewController {

    private final AIResumeService aiResumeService;

    @GetMapping(value = "/user/resumes", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity<String> showResume() {
        return ResponseEntity.ok(aiResumeService.renderResume());
    }
}
