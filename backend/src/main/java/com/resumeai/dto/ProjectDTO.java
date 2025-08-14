package com.resumeai.dto;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDTO {
    private UUID id;
    private String projectName;
    private String description;
    private String url;
}
