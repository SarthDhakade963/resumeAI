package com.resumeai.controller;

import com.resumeai.dto.EducationDTO;
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
