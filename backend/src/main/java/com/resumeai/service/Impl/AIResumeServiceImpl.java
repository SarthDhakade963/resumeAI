package com.resumeai.service.Impl;

import com.resumeai.dto.ResumeDTO;
import com.resumeai.repository.*;
import com.resumeai.service.AIResumeService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIResumeServiceImpl extends ResumeServiceImpl implements AIResumeService {
    private final OpenAiService openAiService;

    public AIResumeServiceImpl(UserRepository userRepository, SkillRepository skillRepository, ProjectRepository projectRepository, EducationRepository educationRepository, WorkExperienceRepository workExperienceRepository, TemplateEngine templateEngine, OpenAiService openAiService) {
        super(userRepository, skillRepository, projectRepository, educationRepository, workExperienceRepository, templateEngine);
        this.openAiService = openAiService;
    }

    @Override
    public ResumeDTO enhanceResume() {
        ResumeDTO resumeData = getResumeData();

        String prompt = String.format(
                "I will provide you structured resume details in the following format:\n" +
                        "Name: %s\n" +
                        "Email: %s\n" +
                        "Skills: %s\n" +
                        "Projects: %s\n" +
                        "Education: %s\n" +
                        "Work Experience: %s\n\n" +

                        "TASK: Transform this data into a professional, modern, recruiter-friendly resume and OUTPUT IT AS A THYMELEAF HTML TEMPLATE.\n\n" +

                        "STRICT OUTPUT REQUIREMENTS (Thymeleaf):\n" +
                        "- Return VALID HTML5 with a single <html> document; include <head> and <body>.\n" +
                        "- Use Thymeleaf attributes only (th:text, th:each, th:if, th:href, th:classappend, etc.).\n" +
                        "- Assume the Spring model provides an attribute 'profile' with fields:\n" +
                        "  user.fullName (String), user.email (String),\n" +
                        "  user.summary (String),\n" +
                        "  user.skills (List<String>),\n" +
                        "  user.projects (List<Project>{ name, link (optional), description }),\n" +
                        "  user.education (List<Edu>{ degree, fieldOfStudy, institution, startDate, endDate, gpa (optional)}),\n" +
                        "  user.experience (List<Exp>{ title, company, location, startDate, endDateOrPresent }).\n" +
                        "- Bind all dynamic values using 'th:text' or 'th:each'. Do NOT hardcode the provided values—use the model fields above.\n" +
                        "- Include sections in this order: Header (name/email), Summary, Skills, Projects, Education, Experience.\n" +
                        "- In Projects/Education/Experience, iterate with th:each and render bullet points via <ul><li th:each>.\n" +
                        "- For optional fields (links, GPA, tech tags), wrap in th:if so they only render when present.\n" +
                        "- Keep classes semantic and minimal; no external CSS/JS (inline <style> allowed).\n\n" +

                        "WRITING & CONTENT RULES:\n" +
                        "- Use impactful, concise language with strong action verbs and measurable outcomes (e.g., \"Improved throughput by 25%%\").\n" +
                        "- Optimize for ATS: naturally include relevant keywords from skills/projects/experience.\n" +
                        "- Prefer results/impact over responsibilities; avoid redundancy.\n\n" +

                        "FINAL OUTPUT FORMAT:\n" +
                        "- Deliver ONLY the Thymeleaf HTML (no markdown fences, no extra commentary).\n" +
                        "- Ensure it is copy-paste ready into a Thymeleaf template file.\n",
                resumeData.getUser().getFullName(),
                resumeData.getUser().getEmail(),
                resumeData.getUser().getSummary(),
                resumeData.getSkills().toString(),
                resumeData.getProjects().toString(),
                resumeData.getEducations().toString(),
                resumeData.getWorkExperiences().toString()
        );

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-4o-mini") // lightweight + good quality
                .messages(List.of(new ChatMessage("user", prompt)))
                .maxTokens(1000)
                .build();

        String aiOutput = openAiService.createChatCompletion(request)
                .getChoices()
                .getFirst()
                .getMessage()
                .getContent();

        ResumeDTO resumeDTO = new ResumeDTO();

        resumeDTO.setEnhancedResume(aiOutput);

        return resumeDTO;
    }

    @Override
    public ResumeDTO getResumeData() {
        return super.getResumeData();
    }

    @Override
    public byte[] generateResume() {
        ResumeDTO enhancedResume = enhanceResume();
        String html = enhancedResume.getEnhancedResume();

        try {
            String puppeteerUrl = "http://localhost:3001/generate-pdf";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("html", html);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    puppeteerUrl,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    byte[].class
            );

            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF via Puppeteer", e);
        }
    }
}
