package com.resumeai.service.Impl;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import com.resumeai.service.OllamaService;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.resumeai.dto.Resume;
import com.resumeai.dto.ResumeDTO;
import com.resumeai.model.User;
import com.resumeai.repository.EducationRepository;
import com.resumeai.repository.ProjectRepository;
import com.resumeai.repository.SkillRepository;
import com.resumeai.repository.UserRepository;
import com.resumeai.repository.WorkExperienceRepository;
import com.resumeai.service.AIResumeService;

@Service
public class AIResumeServiceImpl extends ResumeServiceImpl implements AIResumeService {

    private static final Logger log = LoggerFactory.getLogger(AIResumeServiceImpl.class);
    private final OllamaService ollamaService;
    private final TemplateEngine stringTemplateEngine;
    private final RestTemplate restTemplate;

    @Value("${PUPPETEER_BASE_URL}")
    private String puppeteerUrl;

    // Cache the enhanced resume after first generation
    private final Map<UUID, Resume> enhancedResumeCache = new ConcurrentHashMap<>();

    private Resume cachedAiGenResume = null;

    private Resume userUpdatedResume = null;

    public AIResumeServiceImpl(UserRepository userRepository,
                               SkillRepository skillRepository,
                               ProjectRepository projectRepository,
                               EducationRepository educationRepository,
                               WorkExperienceRepository workExperienceRepository,
                               TemplateEngine stringTemplateEngine,
                               OllamaService ollamaService, RestTemplate restTemplate) {
        super(userRepository, skillRepository, projectRepository, educationRepository, workExperienceRepository,
                stringTemplateEngine);
        this.ollamaService = ollamaService;
        this.stringTemplateEngine = stringTemplateEngine;
        this.restTemplate = restTemplate;
    }

    @Override
    public Resume sendResume() {
        return cachedAiGenResume != null ? (userUpdatedResume != null ? userUpdatedResume : cachedAiGenResume) : enhanceResume();
    }

    private Resume enhanceResume() {
        User user = getLoggedInUser();

        ResumeDTO resumeData = getResumeData();

        Resume resume = new Resume();
        resume.setName(user.getFullName());
        resume.setEmail(user.getEmail());
        // Generate each section individually
        resume.setSummary(ollamaService.sanitizeAndValidateHtml(ollamaService.refineSection("summary", user.getSummary())));
        resume.setSkills(ollamaService.sanitizeAndValidateHtml(ollamaService.refineSection("skills", resumeData.getSkills())));
        resume.setProjects(ollamaService.sanitizeAndValidateHtml(ollamaService.refineSection("projects", resumeData.getProjects())));
        resume.setEducation(ollamaService.sanitizeAndValidateHtml(ollamaService.refineSection("education", resumeData.getEducations())));
        if (!user.isFresher()) {
            resume.setWorkExperience(ollamaService.sanitizeAndValidateHtml(ollamaService.refineSection("work experience", resumeData.getWorkExperiences())));
        }

        System.out.println("-----");

        System.out.println(resume);

        cachedAiGenResume = resume;

        return resume;
    }


    private String renderResume(Resume resume) {
        User user = getLoggedInUser();
        Context context = new Context();

        Resume cachedResume = enhancedResumeCache.get(user.getId());

        System.out.println("Cached Resume : " + cachedResume);

        if (cachedResume != null) {
            System.out.println("Using cached resume for user " + user.getId());
            context.setVariable("resume", cachedResume);
        } else {
            System.out.println("No cached resume found for user " + user.getId() + ". Using provided resume.");
            context.setVariable("resume", resume);
        }

        try {
            String renderedResume = stringTemplateEngine.process("resume", context);
            System.out.println("Resume rendered successfully for user " + user.getFullName());
            return renderedResume;
        } catch (Exception e) {
            System.err.println("Error rendering resume for user " + user.getId() + ": " + e.getMessage());
            throw e; // Rethrow or handle as needed
        }
    }

    public String sanitizeAndValidateHtml(String htmlContent) {
        if (htmlContent == null || htmlContent.trim().isEmpty()) {
            return "";
        }
        return Jsoup.clean(htmlContent, Safelist.basicWithImages());
    }


    @Override
    public String saveResume(Resume resume) {
        User user = getLoggedInUser();

        resume.setEducation(sanitizeAndValidateHtml(resume.getEducation()));
        resume.setProjects(sanitizeAndValidateHtml(resume.getProjects()));
        resume.setSkills(sanitizeAndValidateHtml(resume.getSkills()));
        resume.setSummary(sanitizeAndValidateHtml(resume.getSummary()));
        resume.setWorkExperience(sanitizeAndValidateHtml(resume.getWorkExperience()));

        userUpdatedResume = resume;

        System.out.println("User updated resume ");
        System.out.println("User updated resume summary" + userUpdatedResume.getSummary());
        System.out.println("User updated resume skills" + userUpdatedResume.getSkills());
        System.out.println("User updated resume projects" + userUpdatedResume.getProjects());
        System.out.println("User updated resume Education" + userUpdatedResume.getEducation());
        System.out.println("User updated resume workExperience" + userUpdatedResume.getWorkExperience());

        try {
            // throws error if html is not compatible
            renderResume(userUpdatedResume);
        } catch (Exception e) {
            System.out.println("Error rendering resume for user {}: {} " + user.getFullName() + " " + e.getMessage());
            return "Error while previewing resume. Please fix the content.";
        }

        // if it is process then only it is ready to saved and it is ready to download
        Resume savedResume = new Resume();
        savedResume.setName(userUpdatedResume.getName());
        savedResume.setEmail(userUpdatedResume.getEmail());
        savedResume.setSummary(userUpdatedResume.getSummary());
        savedResume.setSkills(userUpdatedResume.getSkills());
        savedResume.setProjects(userUpdatedResume.getProjects());
        savedResume.setEducation(userUpdatedResume.getEducation());
        savedResume.setWorkExperience(userUpdatedResume.getWorkExperience());

        System.out.println("Updated Saved Resume : ");
        System.out.println(savedResume);

        enhancedResumeCache.put(user.getId(), savedResume);

        return "Resume saved successfully.";
    }

    @Override
    public String previewResume() {
        User user = getLoggedInUser();
        try {
            // Render the resume with Thymeleaf to catch any HTML/template issues
            return renderResume(enhancedResumeCache.get(user.getId()));
        } catch (Exception e) {
            log.error("Error rendering resume for preview for user {}: {}", user.getId(), e.getMessage());
            // You can throw a custom exception or return an error message
            throw new RuntimeException("Error while previewing resume. Please fix the content.");
        }
    }

    @Override
    public byte[] generatePDF() {
        System.out.println("GENERATING PDF");
        User user = getLoggedInUser();

        // 1. Generate resume HTML using Thymeleaf
        String html = renderResume(enhancedResumeCache.get(user.getId()));

        log.info("Generated HTML for PDF: {}", html.substring(0, Math.min(200, html.length())));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("html", html);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(
                puppeteerUrl,
                HttpMethod.POST,
                requestEntity,
                byte[].class);

        return response.getBody();
    }

}
