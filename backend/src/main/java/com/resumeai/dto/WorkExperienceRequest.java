package com.resumeai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("isFresher")
    private boolean isFresher;
    private List<WorkExperienceDTO> workExperiences;
}

