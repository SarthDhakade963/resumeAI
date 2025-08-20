package com.resumeai.controller;


import com.resumeai.dto.SkillDTO;
import com.resumeai.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("user/skills")
@RequiredArgsConstructor
public class SkillController {
    private final SkillService skillService;

    @PostMapping
    public ResponseEntity<String> addSkill(@RequestBody List<SkillDTO> skillDTO) {
        // loop through skills and save them
        for (SkillDTO skill : skillDTO) {
            skillService.addSkill(skill);
        }
        return ResponseEntity.ok("Skills saved Successfully");
    }

    @GetMapping
    public ResponseEntity<List<SkillDTO>> getSkills() {
        return ResponseEntity.ok(skillService.getSkills());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillDTO> updateSkills(@PathVariable UUID id, @RequestBody SkillDTO skillDTO) {
        return ResponseEntity.ok(skillService.updateSkill(id, skillDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkills(@PathVariable UUID id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
