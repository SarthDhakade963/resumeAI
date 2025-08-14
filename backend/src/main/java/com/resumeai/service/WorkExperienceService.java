package com.resumeai.service;

import com.resumeai.dto.WorkExperienceDTO;
import com.resumeai.model.Skill;
import com.resumeai.model.User;
import com.resumeai.model.WorkExperience;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.UUID;

public interface WorkExperienceService {
    WorkExperienceDTO addWorkExperience(WorkExperienceDTO expDTO);

    List<WorkExperienceDTO> getWorkExperience();

    WorkExperienceDTO updateWorkExperience(UUID id, WorkExperienceDTO expDTO);

    void deleteWorkExperience(UUID id);
}
