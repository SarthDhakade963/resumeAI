package com.resumeai.controller;

import com.resumeai.dto.WorkExperienceDTO;
import com.resumeai.dto.WorkExperienceRequest;
import com.resumeai.service.WorkExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/work-exp")
@RequiredArgsConstructor
public class WorkExperienceController {
    private final WorkExperienceService workExperienceService;

    @PostMapping
    public ResponseEntity<String> addWorkExperience(@RequestBody WorkExperienceRequest expReq) {
        if (expReq.isFresher()) {
            workExperienceService.markAsFresher();
            return ResponseEntity.ok("Fresher profile saved");
        }

        expReq.getWorkExperiences()
                .forEach(workExperienceService::addWorkExperience);

        return ResponseEntity.ok("Work Experience saved");
    }

    @GetMapping
    public ResponseEntity<List<WorkExperienceDTO>> getWorkExperiences() {
        return ResponseEntity.ok(workExperienceService.getWorkExperience());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkExperienceDTO> updateWorkExperience(@PathVariable UUID id, @RequestBody WorkExperienceDTO expDTO) {
        return ResponseEntity.ok(workExperienceService.updateWorkExperience(id, expDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkExperience(@PathVariable UUID id) {
        workExperienceService.deleteWorkExperience(id);
        return ResponseEntity.noContent().build();
    }
}