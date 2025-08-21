package com.resumeai.service.Impl;

import com.resumeai.dto.ResumeDTO;
import com.resumeai.dto.SkillDTO;
import com.resumeai.mapper.*;
import com.resumeai.model.User;
import com.resumeai.repository.*;
import com.resumeai.service.ResumeService;
import com.resumeai.service.Signable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeServiceImpl extends Signable implements ResumeService {

    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final TemplateEngine templateEngine;
    private final RestTemplate restTemplate = new RestTemplate();

    public ResumeServiceImpl(UserRepository userRepository,
                             SkillRepository skillRepository,
                             ProjectRepository projectRepository,
                             EducationRepository educationRepository,
                             WorkExperienceRepository workExperienceRepository,
                             TemplateEngine templateEngine) {
        super(userRepository);
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.educationRepository = educationRepository;
        this.workExperienceRepository = workExperienceRepository;
        this.templateEngine = templateEngine;
    }

    @Override
    public ResumeDTO getResumeData() {
        User user = getLoggedInUser();

        return ResumeDTO.builder()
                .user(UserMapper.toDTO(user))
                .skills(skillRepository.findByUser(user).stream().map(SkillMapper::toDTO).toList())
                .projects(projectRepository.findByUser(user).stream().map(ProjectMapper::toDto).toList())
                .educations(educationRepository.findByUser(user).stream().map(EducationMapper::toDTO).toList())
                .workExperiences(workExperienceRepository.findByUser(user).stream().map(WorkExperienceMapper::toDTO).toList())
                .build();
    }

    @Override
    public byte[] generateResume() {
        // 1. Convert resume data into HTML (using Thymeleaf/Freemarker or manually build)
        String html = buildResumeHtml(getResumeData());

        // 2. Send HTML to Puppeteer service
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

    private String buildResumeHtml(ResumeDTO resumeData) {
        Context context = new Context();
        context.setVariable("name", resumeData.getUser().getFullName());
        context.setVariable("email", resumeData.getUser().getEmail());
//        context.setVariable("mobile", resumeData.getUser().getPhone());
//        context.setVariable("linkedin", resumeData.getUser().getLinkedin());
//        context.setVariable("address", resumeData.getUser().getAddress());
        context.setVariable("summary", resumeData.getUser().getSummary());
        context.setVariable("education", resumeData.getEducations());
        context.setVariable("workExperience", resumeData.getWorkExperiences());
//        context.setVariable("activities", resumeData.getUser().getActivities());
        context.setVariable("projects", resumeData.getProjects());
        context.setVariable("skills", resumeData.getSkills());
//        context.setVariable("certifications", resumeData.getUser().getCertifications());

        return templateEngine.process("resume", context); // loads resume.html
    }
}
