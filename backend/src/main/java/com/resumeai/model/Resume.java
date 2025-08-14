package com.resumeai.model;

import com.resumeai.model.superclass.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "resumes")
public class Resume extends Auditable {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    // Many resumes belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // One resume has many work experiences
    // Resume can reference *specific* items from User's data
    @ManyToMany
    @JoinTable(
            name = "resume_work_experience",
            joinColumns = @JoinColumn(name = "resume_id"),
            inverseJoinColumns = @JoinColumn(name = "work_experience_id")
    )
    @Builder.Default
    private List<WorkExperience> workExperiences = new ArrayList<>();

    // One resume has many education entries
    @ManyToMany
    @JoinTable(
            name = "resume_education",
            joinColumns = @JoinColumn(name = "resume_id"),
            inverseJoinColumns = @JoinColumn(name = "education_id")
    )
    @Builder.Default
    private List<Education> educations = new ArrayList<>();

    // Many resume has many skills
    @ManyToMany
    @JoinTable(
            name = "resume_skill",
            joinColumns = @JoinColumn(name = "resume_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private List<Skill> skills = new ArrayList<>();

    // Many resume has many projects
    @ManyToMany
    @JoinTable(
            name = "resume_project",
            joinColumns = @JoinColumn(name = "resume_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
