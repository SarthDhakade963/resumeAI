package com.resumeai.mapper;

import com.resumeai.dto.ProjectDTO;
import com.resumeai.model.Project;

public class ProjectMapper {
    public static ProjectDTO toDto(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .projectName(project.getProjectName())
                .url(project.getUrl())
                .description(project.getDescription())
                .build();
    }

    public static Project toEntity(ProjectDTO projectDTO) {
        return Project.builder()
                .projectName(projectDTO.getProjectName())
                .description(projectDTO.getDescription())
                .url(projectDTO.getUrl())
                .build();
    }
}
