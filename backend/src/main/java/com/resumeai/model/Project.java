package com.resumeai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String url;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
}
