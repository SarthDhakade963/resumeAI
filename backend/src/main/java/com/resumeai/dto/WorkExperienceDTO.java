package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorkExperienceDTO {
    private UUID id;
    private String companyName;
    private String position;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
