package com.resumeai.mapper;

import com.resumeai.model.WorkExperience;

import java.util.List;
import java.util.stream.Collectors;
import com.resumeai.dto.WorkExperienceDTO;

public class WorkExperienceMapper {
    public static WorkExperienceDTO toDTO(WorkExperience exp) {
        return WorkExperienceDTO.builder()
                .id(exp.getId())
                .companyName(exp.getCompanyName())
                .position(exp.getPosition())
                .description(exp.getDescription())
                .startDate(exp.getStartDate())
                .endDate(exp.getEndDate())
                .currentlyWorking(exp.isCurrentlyWorking())
                .build();
    }

    public static WorkExperience toEntity(WorkExperienceDTO dto) {
        return WorkExperience.builder()
                .id(dto.getId())
                .companyName(dto.getCompanyName())
                .position(dto.getPosition())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .currentlyWorking(dto.isCurrentlyWorking())
                .build();
    }

    public static List<WorkExperience> toEntityList(List<WorkExperienceDTO> dtos) {
        return dtos.stream().map(WorkExperienceMapper::toEntity).collect(Collectors.toList());
    }

    public static List<WorkExperienceDTO> toDTOList(List<WorkExperience> entities) {
        return entities.stream().map(WorkExperienceMapper::toDTO).collect(Collectors.toList());
    }
}
