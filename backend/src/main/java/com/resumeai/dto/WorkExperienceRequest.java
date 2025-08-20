package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkExperienceRequest {
    private boolean isFresher;
    private List<WorkExperienceDTO> workExperiences;
}

