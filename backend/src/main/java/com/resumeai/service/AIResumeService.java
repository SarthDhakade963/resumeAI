package com.resumeai.service;

import com.resumeai.dto.Resume;

public interface AIResumeService extends ResumeService{
    Resume enhanceResume();

    String renderResume();
}
