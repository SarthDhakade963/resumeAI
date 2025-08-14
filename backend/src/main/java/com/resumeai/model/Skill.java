package com.resumeai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    private String proficiency;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
