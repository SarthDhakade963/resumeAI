package com.resumeai.repository;

import com.resumeai.model.Skill;
import com.resumeai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {
    List<Skill> findByUser(User user);
}
