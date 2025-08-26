package com.resumeai.service.Impl;

import com.resumeai.dto.Resume;
import com.resumeai.dto.ResumeDTO;
import com.resumeai.repository.*;
import com.resumeai.service.AIResumeService;
import com.resumeai.service.OllamaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class AIResumeServiceImpl extends ResumeServiceImpl implements AIResumeService {

    private static final Logger log = LoggerFactory.getLogger(AIResumeServiceImpl.class);
    private final OllamaService ollamaService;
    private final TemplateEngine stringTemplateEngine;

    public AIResumeServiceImpl(UserRepository userRepository,
                               SkillRepository skillRepository,
                               ProjectRepository projectRepository,
                               EducationRepository educationRepository,
                               WorkExperienceRepository workExperienceRepository,
                               TemplateEngine stringTemplateEngine,
                               OllamaService ollamaService) {
        super(userRepository, skillRepository, projectRepository, educationRepository, workExperienceRepository, stringTemplateEngine);
        this.ollamaService = ollamaService;
        this.stringTemplateEngine = stringTemplateEngine;
    }

    // ----------------------------
    // Section-by-section enhancement
    // ----------------------------
    @Override
    public Resume enhanceResume() {
        ResumeDTO resumeData = getResumeData();

        Resume resume = new Resume();
        resume.setName(resumeData.getUser().getFullName());
        resume.setEmail(resumeData.getUser().getEmail());
        // Generate each section individually
        resume.setSummary(refineSection("summary", resumeData.getUser().getSummary()));
        resume.setSkills(refineSection("skills", resumeData.getSkills()));
        resume.setProjects(refineSection("projects", resumeData.getProjects()));
        resume.setEducation(refineSection("education", resumeData.getEducations()));
        resume.setWorkExperience(refineSection("work experience", resumeData.getWorkExperiences()));

        System.out.println(resume);
        System.out.println("-----");

        return resume;
    }

    // Refine one section using Ollama phi3:mini
    private String refineSection(String sectionName, Object rawContent) {
        if (rawContent == null) return "";

        try {
            String prompt = String.format("""
                Refine the following %s for a resume. 
                Keep it concise, professional, and readable.
                
                Content:
                %s
                """, sectionName, rawContent);

            String refined = ollamaService.generateText(prompt);

            // fallback in case model returns empty
            return (refined == null || refined.isBlank()) ? rawContent.toString() : refined;

        } catch (Exception e) {
            log.warn("Failed to refine {}: {}", sectionName, e.getMessage());
            return rawContent.toString();
        }
    }

    // ----------------------------
    // Resume rendering
    // ----------------------------
    @Override
    public String renderResume() {
        Resume resume = enhanceResume();

        Context context = new Context();
        context.setVariable("resume", resume);

        return stringTemplateEngine.process("resume", context);
    }

    @Override
    public ResumeDTO getResumeData() {
        return super.getResumeData();
    }
}
