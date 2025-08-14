package com.resumeai.controller;


import com.resumeai.dto.ProjectDTO;
import com.resumeai.dto.SkillDTO;
import com.resumeai.mapper.ProjectMapper;
import com.resumeai.model.Project;
import com.resumeai.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectDTO> addProject(@RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.addProject(projectDTO));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getProjects() {
        return ResponseEntity.ok(projectService.getProject());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable UUID id,@RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
