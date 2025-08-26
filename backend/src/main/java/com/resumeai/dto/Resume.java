package com.resumeai.dto;

import lombok.Data;

@Data
public class Resume {
    private String name;
    private String email;
    private String summary;
    private String skills;
    private String projects;
    private String education;
    private String workExperience;
}
