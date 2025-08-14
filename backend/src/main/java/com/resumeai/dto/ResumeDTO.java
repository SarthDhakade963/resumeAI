package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {
    private UUID id;
    private UserDTO user;
    private List<SkillDTO> skills;
    private List<ProjectDTO> projects;
    private List<EducationDTO> educations;
    private List<WorkExperienceDTO> workExperiences;
}
