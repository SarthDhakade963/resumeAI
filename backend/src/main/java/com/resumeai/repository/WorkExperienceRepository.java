package com.resumeai.repository;

import com.resumeai.model.User;
import com.resumeai.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, UUID> {
    List<WorkExperience> findByUser(User user);
}
