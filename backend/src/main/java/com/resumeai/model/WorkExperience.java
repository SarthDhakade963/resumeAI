package com.resumeai.model;

import com.resumeai.model.superclass.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "work_experience")
public class WorkExperience extends Auditable {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "company_name")
    private String companyName;

    @Column(nullable = false)
    private String position;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
