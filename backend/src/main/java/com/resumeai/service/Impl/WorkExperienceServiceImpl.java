package com.resumeai.service.Impl;

import com.resumeai.dto.WorkExperienceDTO;
import com.resumeai.mapper.WorkExperienceMapper;
import com.resumeai.model.User;
import com.resumeai.model.WorkExperience;
import com.resumeai.repository.UserRepository;
import com.resumeai.repository.WorkExperienceRepository;
import com.resumeai.service.Signable;
import com.resumeai.service.WorkExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WorkExperienceServiceImpl extends Signable implements WorkExperienceService  {
    private final WorkExperienceRepository workExperienceRepository;

    public WorkExperienceServiceImpl(WorkExperienceRepository workExperienceRepository, UserRepository userRepository) {
        super(userRepository);
        this.workExperienceRepository = workExperienceRepository;
    }

    @Override
    public WorkExperienceDTO addWorkExperience(WorkExperienceDTO expDTO) {
        WorkExperience exp = WorkExperienceMapper.toEntity(expDTO);
        exp.setUser(getLoggedInUser());
        WorkExperience savedExp = workExperienceRepository.save(exp);
        return WorkExperienceMapper.toDTO(savedExp);
    }

    @Override
    public List<WorkExperienceDTO> getWorkExperience() {
        return workExperienceRepository.findByUser(getLoggedInUser()).stream().map(WorkExperienceMapper::toDTO).toList();
    }

    @Override
    public WorkExperienceDTO updateWorkExperience(UUID id, WorkExperienceDTO expDTO) {
        WorkExperience exp = workExperienceRepository.findById(id).orElseThrow(() -> new RuntimeException("Work Experience not found"));

        if(!exp.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("UnAuthorized");
        }


        exp.setCompanyName(expDTO.getCompanyName());
        exp.setPosition(expDTO.getPosition());
        exp.setDescription(expDTO.getDescription());
        exp.setStartDate(expDTO.getStartDate());
        exp.setEndDate(expDTO.getEndDate());

        WorkExperience savedExp = workExperienceRepository.save(exp);

        return WorkExperienceMapper.toDTO(savedExp);
    }

    @Override
    public void deleteWorkExperience(UUID id) {
        WorkExperience exp = workExperienceRepository.findById(id).orElseThrow(() -> new RuntimeException("Work Experience not found"));

        if(!exp.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("UnAuthorized");
        }

        workExperienceRepository.delete(exp);
    }
}
