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
public class EducationDTO {
    private UUID id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String grade;
    private LocalDate startDate;
    private LocalDate endDate;
}
