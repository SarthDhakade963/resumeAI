package com.resumeai.service;

import com.resumeai.dto.ProjectDTO;
import com.resumeai.model.Project;

import java.util.List;
import java.util.UUID;

public interface ProjectService {
    public ProjectDTO addProject(ProjectDTO projectDTO);

    public List<ProjectDTO> getProject();

    ProjectDTO updateProject(UUID id, ProjectDTO projectDTO);

    void deleteProject(UUID id);
}
