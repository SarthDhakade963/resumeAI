package com.resumeai.service;

import com.resumeai.dto.SkillDTO;
import com.resumeai.model.Skill;

import java.util.List;
import java.util.UUID;

public interface SkillService {
    SkillDTO addSkill(SkillDTO skillDTO);

    List<SkillDTO> getSkills();

    SkillDTO updateSkill(UUID id, SkillDTO skillDTO);

    void deleteSkill(UUID id);
}
