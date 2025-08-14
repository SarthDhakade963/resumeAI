package com.resumeai.mapper;

import com.resumeai.dto.EducationDTO;
import com.resumeai.model.Education;

public class EducationMapper {
    public static EducationDTO toDTO(Education education) {
        return EducationDTO.builder()
                .id(education.getId())
                .degree(education.getDegree())
                .fieldOfStudy(education.getFieldOfStudy())
                .institution(education.getInstitution())
                .startDate(education.getStartDate())
                .endDate(education.getEndDate())
                .build();
    }

    public static Education toEntity(EducationDTO educationDTO) {
        return Education.builder()
                .institution(educationDTO.getInstitution())
                .degree(educationDTO.getDegree())
                .fieldOfStudy(educationDTO.getFieldOfStudy())
                .startDate(educationDTO.getStartDate())
                .endDate(educationDTO.getEndDate())
                .build();
    }
}
