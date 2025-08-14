package com.resumeai.controller;

import com.resumeai.dto.WorkExperienceDTO;
import com.resumeai.mapper.EducationMapper;
import com.resumeai.mapper.WorkExperienceMapper;
import com.resumeai.model.WorkExperience;
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
    private WorkExperienceService workExperienceService;

    @PostMapping
    public ResponseEntity<WorkExperienceDTO> addWorkExperience(@RequestBody WorkExperienceDTO expDTO) {
        return ResponseEntity.ok(workExperienceService.addWorkExperience(expDTO));
    }

    @GetMapping
    public ResponseEntity<List<WorkExperienceDTO>> getWorkExperiences(@RequestBody WorkExperienceDTO expDTO) {
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
