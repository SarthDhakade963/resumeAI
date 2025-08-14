package com.resumeai.repository;

import com.resumeai.model.Project;
import com.resumeai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByUser(User user);
}
