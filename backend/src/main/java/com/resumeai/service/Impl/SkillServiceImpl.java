package com.resumeai.service.Impl;

import com.resumeai.dto.SkillDTO;
import com.resumeai.mapper.SkillMapper;
import com.resumeai.model.Skill;
import com.resumeai.repository.SkillRepository;
import com.resumeai.repository.UserRepository;
import com.resumeai.service.Signable;
import com.resumeai.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SkillServiceImpl extends Signable implements SkillService {
    private final SkillRepository skillRepository;

    public SkillServiceImpl(SkillRepository skillRepository, UserRepository userRepository) {
        super(userRepository);
        this.skillRepository = skillRepository;
    }

    @Override
    public SkillDTO addSkill(SkillDTO skillDTO) {
        Skill skill = SkillMapper.toEntity(skillDTO);
        skill.setUser(getLoggedInUser());
        Skill saved = skillRepository.save(skill);
        return SkillMapper.toDTO(saved);
    }

    @Override
    public List<SkillDTO> getSkills() {
        return skillRepository.findByUser(getLoggedInUser()).stream().map(SkillMapper::toDTO).toList();
    }

    @Override
    public SkillDTO updateSkill(UUID id, SkillDTO skillDTO) {
        Skill skill = skillRepository.findById(id).orElseThrow(() -> new RuntimeException("Skill not found"));

        if(!skill.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("Unauthorized");
        }

        skill.setSkillName(skillDTO.getSkillName());
        skill.setProficiency(skillDTO.getProficiency());

        Skill updated = skillRepository.save(skill);
        return SkillMapper.toDTO(updated);
    }

    @Override
    public void deleteSkill(UUID id) {
        Skill skill = skillRepository.findById(id).orElseThrow(() -> new RuntimeException("Skill not found"));

        if(!skill.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("Unauthorized");
        }

        skillRepository.delete(skill);
    }


}
