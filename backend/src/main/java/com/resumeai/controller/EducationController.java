package com.resumeai.controller;

import com.resumeai.dto.EducationDTO;
import com.resumeai.mapper.EducationMapper;
import com.resumeai.model.Education;
import com.resumeai.service.EducationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/edu")
public class EducationController {
    private EducationService educationService;

    @PostMapping
    public ResponseEntity<EducationDTO> addEducation(@RequestBody EducationDTO educationDTO) {
        return ResponseEntity.ok(educationService.addEducation(educationDTO));
    }

    @GetMapping
    public ResponseEntity<List<EducationDTO>> getEducations() {
        return ResponseEntity.ok(educationService.getEducation());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EducationDTO> updateEducation(@PathVariable UUID id,@RequestBody EducationDTO educationDTO) {
        return ResponseEntity.ok(educationService.updateEducation(id, educationDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable UUID id) {
        educationService.deleteEducation(id);

        return ResponseEntity.noContent().build();
    }
}
