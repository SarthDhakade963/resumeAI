package com.resumeai.service;

import com.resumeai.dto.EducationDTO;
import com.resumeai.model.Education;
import com.resumeai.model.User;

import java.util.List;
import java.util.UUID;

public interface EducationService {
    EducationDTO addEducation(EducationDTO eduDTO);

    List<EducationDTO> getEducation();

    EducationDTO updateEducation(UUID id, EducationDTO eduDTO);

    void deleteEducation(UUID id);
}
