package com.resumeai.mapper;

import com.resumeai.dto.*;
import com.resumeai.model.User;

import java.util.List;

public class ResumeMapper {
    public static ResumeDTO toDTO(User user,
                                  List<SkillDTO> skills,
                                  List<ProjectDTO> projects,
                                  List<EducationDTO> educations,
                                  List<WorkExperienceDTO> workExperiences
    )
    {
        return ResumeDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .profilePicUrl(user.getProfilePicUrl())
                .skills(skills)
                .projects(projects)
                .educations(educations)
                .workExperiences(workExperiences)
                .build();
    }
}
