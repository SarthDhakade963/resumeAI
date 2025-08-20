package com.resumeai.service;

import com.resumeai.dto.WorkExperienceDTO;
import java.util.List;
import java.util.UUID;

public interface WorkExperienceService {
    WorkExperienceDTO addWorkExperience(WorkExperienceDTO expDTO);

    List<WorkExperienceDTO> getWorkExperience();

    WorkExperienceDTO updateWorkExperience(UUID id, WorkExperienceDTO expDTO);

    void deleteWorkExperience(UUID id);

    boolean markAsFresher();
}
