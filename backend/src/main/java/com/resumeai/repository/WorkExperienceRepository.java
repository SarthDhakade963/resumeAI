package com.resumeai.repository;

import com.resumeai.model.User;
import com.resumeai.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, UUID> {
    List<WorkExperience> findByUser(User user);
}
