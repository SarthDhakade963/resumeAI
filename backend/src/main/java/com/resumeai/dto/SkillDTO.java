package com.resumeai.dto;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SkillDTO {
    private UUID id;
    private String skillName;
    private String proficiency;
}
