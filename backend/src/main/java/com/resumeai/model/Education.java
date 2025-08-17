package com.resumeai.model;

import com.resumeai.model.superclass.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "education")
public class Education extends Auditable {

    @Id
    @GeneratedValue
    private UUID id;

    private String institution;

    private String degree;

    @Column(name = "field_of_study")
    private String fieldOfStudy;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private String grade;

    private boolean currentlyStudying;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
