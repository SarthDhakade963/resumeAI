package com.resumeai.mapper;

import com.resumeai.dto.SkillDTO;
import com.resumeai.model.Skill;

public class SkillMapper {
    public static SkillDTO toDTO(Skill skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .skillName(skill.getSkillName())
                .proficiency(skill.getProficiency())
                .build();
    }

    public static Skill toEntity(SkillDTO skillDTO) {
        return Skill.builder()
                .skillName(skillDTO.getSkillName())
                .proficiency(skillDTO.getProficiency())
                .build();
    }
}
