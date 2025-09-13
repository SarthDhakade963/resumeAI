package com.resumeai.service;

import com.resumeai.dto.Resume;

import java.util.Map;

public interface AIResumeService extends ResumeService{
    Resume sendResume();

    String saveResume(Resume resume);

    String previewResume();

    byte[] generatePDF();
}
