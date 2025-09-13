package com.resumeai.mapper;

import com.resumeai.dto.*;
import com.resumeai.dto.Resume;
import com.resumeai.model.*;

import java.util.List;

public class ResumeMapper {
    public static ResumeDTO toDTO(User user,
                                  List<Skill> skills,
                                  List<Project> projects,
                                  List<Education> educations,
                                  List<WorkExperience> workExperiences
    )
    {
        return ResumeDTO.builder()
                .user(UserMapper.toDTO(user))
                .skills(skills.stream().map(SkillMapper::toDTO).toList())
                .projects(projects.stream().map(ProjectMapper::toDto).toList())
                .educations(educations.stream().map(EducationMapper::toDTO).toList())
                .workExperiences(workExperiences.stream().map(WorkExperienceMapper::toDTO).toList())
                .build();
    }
}