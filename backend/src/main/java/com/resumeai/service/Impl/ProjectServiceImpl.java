package com.resumeai.service.Impl;

import com.resumeai.dto.ProjectDTO;
import com.resumeai.mapper.ProjectMapper;
import com.resumeai.model.Project;
import com.resumeai.model.User;
import com.resumeai.repository.ProjectRepository;
import com.resumeai.repository.UserRepository;
import com.resumeai.service.ProjectService;
import com.resumeai.service.Signable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectServiceImpl extends Signable implements ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository, UserRepository userRepository) {
        super(userRepository);
        this.projectRepository = projectRepository;
    }

    @Override
    public ProjectDTO addProject(ProjectDTO projectDTO) {
        Project project = ProjectMapper.toEntity(projectDTO);
        project.setUser(getLoggedInUser());
        Project savedProject = projectRepository.save(project);
        return ProjectMapper.toDto(savedProject);
    }

    @Override
    public List<ProjectDTO> getProject() {
        return projectRepository.findByUser(getLoggedInUser()).stream().map(ProjectMapper::toDto).toList();
    }

    @Override
    public ProjectDTO updateProject(UUID id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));

        if(!project.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("UnAuthorized");
        }

        project.setProjectName(projectDTO.getProjectName());

        project.setDescription(projectDTO.getDescription());

        project.setUrl(projectDTO.getUrl());

        Project savedProject = projectRepository.save(project);

        return ProjectMapper.toDto(savedProject);
    }

    @Override
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));

        if(!project.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("UnAuthorized");
        }

        projectRepository.delete(project);
    }
}
