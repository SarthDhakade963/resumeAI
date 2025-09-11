package com.resumeai.service.Impl;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.resumeai.dto.Resume;
import com.resumeai.dto.ResumeDTO;
import com.resumeai.repository.EducationRepository;
import com.resumeai.repository.ProjectRepository;
import com.resumeai.repository.SkillRepository;
import com.resumeai.repository.UserRepository;
import com.resumeai.repository.WorkExperienceRepository;
import com.resumeai.service.AIResumeService;
import com.resumeai.service.OllamaService;

@Service
public class AIResumeServiceImpl extends ResumeServiceImpl implements AIResumeService {

    private static final Logger log = LoggerFactory.getLogger(AIResumeServiceImpl.class);
    private final OllamaService ollamaService;
    private final TemplateEngine stringTemplateEngine;
    private final RestTemplate restTemplate;

    // Cache the enhanced resume after first generation
    private Resume enhancedResumeCache = null;

    public AIResumeServiceImpl(UserRepository userRepository,
                               SkillRepository skillRepository,
                               ProjectRepository projectRepository,
                               EducationRepository educationRepository,
                               WorkExperienceRepository workExperienceRepository,
                               TemplateEngine stringTemplateEngine,
                               OllamaService ollamaService, RestTemplate restTemplate) {
        super(userRepository, skillRepository, projectRepository, educationRepository, workExperienceRepository, stringTemplateEngine);
        this.ollamaService = ollamaService;
        this.stringTemplateEngine = stringTemplateEngine;
        this.restTemplate = restTemplate;
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

        System.out.println("-----");

        return resume;
    }

    // Refine one section using Ollama phi3:mini
    private String refineSection(String sectionName, Object rawContent) {
        if (rawContent == null) return "";

        try {
            String prompt = String.format("""
                Refine the following %s into crisp, relevant résumé content.

                Rules:
                    - Output strictly in HTML list format (<ul><li>...</li></ul>).
                    - Include max 2–3 bullet points per section.
                    - Each <li> must be ≤ 15 words.
                    - Only include technical or career-relevant details.
                    - Exclude unrelated professions, education mismatch, or filler content.
                    - Do not include explanations, comments, or word counts.
                    - Return only the HTML, nothing else.

                Content:
                %s
            """, sectionName, rawContent);

            String refined = ollamaService.generateText(prompt).replaceAll("```[a-zA-Z]*", "").replaceAll("```", "").replaceAll("end of li>", "");

            // fallback in case model returns empty
            return refined.isBlank() ? rawContent.toString() : refined;

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

    public byte[] generatePDF() {
        // 1. Generate resume HTML using Thymeleaf
        String html = renderResume();

        log.info("Generated HTML for PDF: {}", html.substring(0, Math.min(200, html.length())));

        // 2. Send HTML to Puppeteer microservice
        String puppeteerUrl = "http://localhost:3001/generate-pdf";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("html", html);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(
                puppeteerUrl,
                HttpMethod.POST,
                requestEntity,
                byte[].class
        );

        return response.getBody();
    }


}
