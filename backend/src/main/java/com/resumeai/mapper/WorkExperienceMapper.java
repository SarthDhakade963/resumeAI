package com.resumeai.mapper;


import com.resumeai.dto.WorkExperienceDTO;
import com.resumeai.model.WorkExperience;

public class WorkExperienceMapper {
    public static WorkExperienceDTO toDTO(WorkExperience exp) {
        return WorkExperienceDTO.builder()
                .id(exp.getId())
                .companyName(exp.getCompanyName())
                .position(exp.getPosition())
                .description(exp.getDescription())
                .startDate(exp.getStartDate())
                .endDate(exp.getEndDate())
                .build();
    }

    public static WorkExperience toEntity(WorkExperienceDTO expDTO) {
        return WorkExperience.builder()
                .companyName(expDTO.getCompanyName())
                .position(expDTO.getPosition())
                .description(expDTO.getDescription())
                .startDate(expDTO.getStartDate())
                .endDate(expDTO.getEndDate())
                .build();
    }

}
