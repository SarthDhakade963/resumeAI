package com.resumeai.service.Impl;

import com.resumeai.dto.EducationDTO;
import com.resumeai.mapper.EducationMapper;
import com.resumeai.mapper.ProjectMapper;
import com.resumeai.model.Education;
import com.resumeai.model.User;
import com.resumeai.repository.EducationRepository;
import com.resumeai.repository.UserRepository;
import com.resumeai.service.EducationService;
import com.resumeai.service.Signable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EducationServiceImpl extends Signable implements EducationService {
    private final EducationRepository educationRepository;

    public EducationServiceImpl(EducationRepository educationRepository, UserRepository userRepository) {
        super(userRepository);
        this.educationRepository = educationRepository;
    }

    @Override
    public EducationDTO addEducation(EducationDTO eduDTO) {
        Education edu = EducationMapper.toEntity(eduDTO);
        edu.setUser(getLoggedInUser());
        Education savedEdu = educationRepository.save(edu);
        return EducationMapper.toDTO(savedEdu);
    }

    @Override
    public List<EducationDTO> getEducation() {
        return educationRepository.findByUser(getLoggedInUser()).stream().map(EducationMapper::toDTO).toList();
    }

    @Override
    public EducationDTO updateEducation(UUID id, EducationDTO eduDTO) {
        Education edu = educationRepository.findById(id).orElseThrow(() -> new RuntimeException("Education not found"));

        if(!edu.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("UnAuthorized");
        }

        edu.setGrade(eduDTO.getGrade());

        edu.setDegree(eduDTO.getDegree());

        edu.setInstitution(eduDTO.getInstitution());

        edu.setStartDate(eduDTO.getStartDate());

        edu.setEndDate(eduDTO.getEndDate());

        Education savedEdu = educationRepository.save(edu);

        return EducationMapper.toDTO(edu);
    }

    @Override
    public void deleteEducation(UUID id) {
        Education edu = educationRepository.findById(id).orElseThrow(() -> new RuntimeException("Education not found"));

        if(!edu.getUser().equals(getLoggedInUser())) {
            throw new RuntimeException("User not found");
        }

        educationRepository.delete(edu);
    }

}
