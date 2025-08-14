package com.resumeai.service.Impl;

import com.resumeai.dto.*;
import com.resumeai.mapper.*;
import com.resumeai.model.User;
import com.resumeai.repository.*;
import com.resumeai.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeServiceImpl extends Signable implements ResumeService {

    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final WorkExperienceRepository workExperienceRepository;

    public ResumeServiceImpl(UserRepository userRepository, SkillRepository skillRepository, ProjectRepository projectRepository, EducationRepository educationRepository, WorkExperienceRepository workExperienceRepository) {
        super(userRepository);
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.educationRepository = educationRepository;
        this.workExperienceRepository = workExperienceRepository;
    }

    @Override
    public ResumeDTO generateResume() {
        User user = getLoggedInUser();

        return ResumeDTO.builder()
                .user(UserMapper.toDTO(user))
                .skills(skillRepository.findByUser(user).stream().map(SkillMapper::toDTO).toList())
                .projects(projectRepository.findByUser(user).stream().map(ProjectMapper::toDto).toList())
                .educations(educationRepository.findByUser(user).stream().map(EducationMapper::toDTO).toList())
                .workExperiences(workExperienceRepository.findByUser(user).stream().map(WorkExperienceMapper::toDTO).toList())
                .build();
    }
}
