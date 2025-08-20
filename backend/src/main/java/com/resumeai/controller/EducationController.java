package com.resumeai.controller;

import com.resumeai.dto.EducationDTO;
import com.resumeai.dto.ProjectDTO;
import com.resumeai.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/edu")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @PostMapping
    public ResponseEntity<String> addEducation(@RequestBody List<EducationDTO> eduDTO) {
        // loop through skills and save them
        for (EducationDTO edu : eduDTO) {
            educationService.addEducation(edu);
        }
        return ResponseEntity.ok("Education saved Successfully");
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
