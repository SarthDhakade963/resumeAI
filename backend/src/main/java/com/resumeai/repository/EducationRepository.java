package com.resumeai.repository;

import com.resumeai.model.Education;
import com.resumeai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EducationRepository extends JpaRepository<Education, UUID> {
    List<Education> findByUser(User user);
}
