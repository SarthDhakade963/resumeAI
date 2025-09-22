package com.resumeai.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.resumeai.dto.EducationDTO;
import com.resumeai.dto.ProjectDTO;
import com.resumeai.dto.SkillDTO;
import com.resumeai.dto.WorkExperienceDTO;
import com.resumeai.service.Impl.AIResumeServiceImpl;
import org.jetbrains.annotations.NotNull;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.parser.Parser;
import org.jsoup.safety.Safelist;
import org.jsoup.select.Elements;
import org.jsoup.select.NodeVisitor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.*;

@Service
public class OllamaService {
    private static final Logger log = LoggerFactory.getLogger(OllamaService.class);

    private final RestTemplate restTemplate;

    @Value("${OLLAMA_BASE_URL}")
    private String OLLAMA_URL;

    public OllamaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateText(String prompt) {

        System.out.println("Ollama Url : " + OLLAMA_URL);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "model", "phi3:mini",
                "prompt", prompt,
                "stream", false // disable streaming to get one JSON response
        );

        HttpEntity<Map<String, Object>> req = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> res = restTemplate.exchange(
                OLLAMA_URL,
                HttpMethod.POST,
                req,
                Map.class);

        if (res.getBody() != null && res.getBody().get("response") != null) {
            return res.getBody().get("response").toString().trim();
        }
        
        return "";
    }

    // Refine one section using O llama phi3:mini
    public String refineSection(String sectionName, Object rawContent) {
        if (rawContent == null) {
            return "";
        }

        try {
            String prompt = switch (sectionName.toLowerCase()) {
                case "summary" -> String.format(
                        """
                                 You are an expert resume consultant.

                                 Refine the following summary to highlight the candidate’s professional strengths, skills, and career goals.

                                 Rules:
                                     - Write in clear, complete sentences with proper grammar and punctuation.
                                     - Focus on measurable achievements, relevant skills, and career aspirations.
                                     - Do not include personal opinions, unrelated details, or generic statements.
                                     - Keep the summary concise: 2–3 lines, no more than 50–60 words.
                                     - Avoid filler words, vague phrases, or repetitive content.
                                     - Use industry-standard terminology and keywords that ATS systems can easily parse.
                                     - ALWAYS Return the summary as a coherent paragraph wrapped in a single <p> tag.
                                     - Do not include bullet points, formatting tags other than <p>, or extra explanations.

                                 Content:
                                 %s

                                """,
                        formatSummary(rawContent));

                case "skills" -> String.format(
                        """
                                 You are an expert resume consultant.

                                        You are given a list of skills. Your task is to classify these skills strictly into appropriate categories commonly used in professional resumes and friendly to ATS systems.

                                        Important guidelines:
                                        - Only use the skills provided in the list; do not add, describe, or elaborate on any other skills.
                                        - Do not copy or structure the categories exactly as in the example below; that example is only to show how categories and skills should be formatted.
                                        - Create only relevant categories based on the provided skills; avoid vague, unnecessary, or overly broad categories.
                                        - List each category once and group all relevant skills under it.
                                        - Format the output exactly as the example shows: a simple HTML unordered list where each category is followed by its skills separated by commas.
                                        - Do not include introductions, explanations, headings, or any extra text outside the <ul> block.
                                        - Do not elaborate on what each skill is or provide definitions.

                                        Example output format (for illustration only; use it as a formatting reference, not content reference):
                                        <ul>
                                            <li>Programming Languages: Java, Python</li>
                                            <li>Tools & Frameworks: Git, Docker</li>
                                            <li>Communication Skills: Public Speaking</li>
                                        </ul>

                                        Now, classify and format the following skills accordingly:

                                        Skills:
                                        %s
                                """,
                        formatSkills(rawContent));

                case "projects" -> String.format(
                        """
                        Refine the following projects into an ATS-friendly format using structured headings and bullet points.
                    
                        Rules:
                        - Output strictly as an HTML unordered list (<ul><li>...</li></ul>).
                        - Do NOT include <html>, <head>, <body>, or any other tags outside <ul> and <li>.
                        - For each project, include:
                            • Project name in bold using <strong> tags
                            • URL separated by '|' after the project name
                        - Below each project, include 2–3 achievement-focused bullet points in a nested <ul>.
                        - Only add tags as shown in the example format. Open and close tags properly where required and nowhere else.
                        - Do NOT nest one project inside another or add extra wrappers.
                        - Include only the provided projects and their details; do not add sample or placeholder projects.
                        - Each bullet point <li> must be ≤ 15 words, focusing on skills, tools, and measurable outcomes where applicable.
                        - Avoid generic statements, filler text, personal opinions, or unrelated details.
                        - Do NOT add trailing periods or punctuation at the end of bullet points or headings.
                        - Do NOT reference or include any file names, libraries, or resources with extensions like '.js', '.css', '.html', '.png', etc.
                        - Use keyword-rich, clear language suitable for ATS parsing.
                        - Do NOT repeat instructions, templates, or placeholder text in the output.
                        - Return only the formatted HTML without extra explanations or notes.
                    
                        Example output format (for illustration only):
                        <ul>
                            <li><strong>E-Commerce Platform</strong> | https://github.com/username/ecommerce
                                <ul>
                                    <li>Developed platform using React and Node.js, improving checkout speed by 25%%</li>
                                    <li>Designed REST API services with Spring Boot, handling over 10,000 daily requests</li>
                                    <li>Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 40%%</li>
                                </ul>
                            </li>
                        </ul>
                    
                        Now, format the following project entries strictly according to the rules above:
                    
                        Projects:
                        %s
                        """,
                        formatProjects(rawContent));



                case "education" -> String.format(
                        """
                        Summarize the following education details into a professional, ATS-optimized HTML format.
                    
                        Guidelines:
                        - Output strictly as an HTML unordered list (<ul><li>...</li></ul>).
                        - Do NOT include any other HTML tags beyond <ul>, <li>, and <strong> where specified.
                        - For each education entry, include:
                            • Degree or certification in bold using <strong> tags
                            • Institution name
                            • Start and end year in "YYYY – YYYY" format
                            • Relevant modules or subjects (2–3 widely recognized subjectss) in a nested list
                            • Academic achievements like CGPA or percentage in a nested list if provided
                        - Format each <li> clearly and concisely, with ≤ 20 words per line where possible.
                        - Use bullet points to enhance readability for humans and ATS tools.
                        - Do not include unrelated courses, extracurricular activities, personal opinions, or filler content.
                        - Ensure proper punctuation, capitalization, and correct grammar.
                        - Do not invent, extrapolate, or elaborate beyond the information provided.
                        - Follow the example structure strictly for guidance; format tags exactly as shown.
                        - Use only the "start year – end year" extracted from dates.
                        - If a single-digit number is provided, treat it as CGPA out of 10; if two digits or more, treat it as a percentage and add the percentage symbol if missing.
                        - Make sure all tags are properly opened and closed; avoid adding extra or misplaced tags.
                        - Return only the HTML list without any explanations, headings, or notes.
                    
                        Example format (for illustration only):
                        <ul>
                            <li><strong>MSc in Public Policy and Management</strong> | King’s College London | 2021 – 2022
                                <ul>
                                    <li>Modules: Economics (1st), Research Methods (1st), e-Services in Marketing (1st)</li>
                                    <li>Dissertation: Impact of Luxury Goods Taxation on Socioeconomic Inequalities (Distinction)</li>
                                </ul>
                            </li>
                        </ul>
                    
                        Now, format the following education entries strictly according to the above guidelines:
                    
                        Educations:
                        %s
                        """,
                        formatEducation(rawContent));




                case "work experience" -> String.format(
                        """
                        Refine the following work experience entries into a professional, ATS-optimized HTML format.
                    
                        Guidelines:
                        - Output strictly as an HTML unordered list (<ul><li>...</li></ul>).
                        - Each work experience must be a single <li> containing:
                            • Position enclosed in <strong> tags
                            • Company name
                            • Employment period formatted as "Start Month Year – End Month Year"
                            • Location; if missing, default to 'Remote' or 'Virtual'
                        - Below each experience, include a nested <ul> with 2–3 bullet points describing key accomplishments or projects.
                        - Each bullet point must be concise (≤ 20 words), focus on skills, tools, and measurable outcomes.
                        - Do NOT add extra <ul>/<li> tags outside this structure; avoid nesting experiences within each other.
                        - Do NOT include unrelated details, personal opinions, filler content, or repeated information.
                        - Ensure proper grammar, punctuation, capitalization, and ATS-friendly keywords.
                        - Avoid referencing file names, URLs, or libraries containing extensions like '.js', '.css', '.html', '.png'.
                        - Do not invent or extrapolate details beyond what is provided.
                        - Ensure all HTML tags are correctly opened and closed; follow the structure exactly as shown.
                        - Return only the formatted HTML list without explanations, headings, or additional text.
                    
                        Example format:
                        <ul>
                            <li><strong>Sales and Investor Relations Analyst</strong> | IDEAGlobal | August 2023 - October 2023 | London, UK
                                <ul>
                                    <li>Utilised cold-calling strategies to sell investment opportunities, achieving 11%% revenue growth</li>
                                    <li>Identified strategic investment opportunities in FinTech start-ups leading to £3.5 million investment</li>
                                    <li>Maintained client relationships through tailored finance solutions, increasing revenue by 10%%</li>
                                </ul>
                            </li>
                        </ul>
                    
                        Now, format the following work experience entries strictly according to these guidelines:
                    
                        Work Experience:
                        %s
                        """,
                        formatWorkExperience(rawContent));




                default -> String.format("""
                        Refine the following content into concise résumé points.

                        Rules:
                            - Output strictly as an HTML list (<ul><li>...</li></ul>).
                            - Include max 2–3 points.
                            - Each <li> must be ≤ 15 words.
                            - Focus on relevant and impactful details.

                        Content:
                        %s
                        """, rawContent);
            };

            String refined = generateText(prompt)
                    .replaceAll("```[a-zA-Z]*", "")
                    .replaceAll("```", "")
                    .replaceAll("end of li>", "")
                    .replaceAll("endlist>", "")
                    .replaceAll("endblock>", "");

            System.out.println("Refined " + sectionName + " : " + refined);

            return refined.isBlank() ? rawContent.toString() : refined;

        } catch (Exception e) {
            log.warn("Failed to refine {}: {}", sectionName, e.getMessage());
            return rawContent.toString();
        }
    }

    private String formatSummary(Object rawContent) {
        if (rawContent == null) {
            return "";
        }

        try {
            String summary = rawContent.toString().trim();

            System.out.println(summary);

            return summary.isEmpty() ? "" : summary;
        } catch (Exception e) {
            log.warn("Failed to format summary: {}", e.getMessage());
            return rawContent.toString();
        }
    }

    private String formatSkills(Object rawContent) {
        System.out.println(rawContent);

        if (rawContent == null) {
            return "";
        }

        try {
            List<?> skillsRaw = (List<?>) rawContent;
            StringBuilder builder = new StringBuilder();

            for (Object obj : skillsRaw) {
                if (obj instanceof SkillDTO skill) {
                    String name = skill.getSkillName();
                    builder.append(name).append(", ");
                }
            }

            // Remove trailing comma and space
            if (builder.length() > 2) {
                builder.setLength(builder.length() - 2);
            }

            System.out.println("format skills: " + builder.toString().trim());

            return builder.toString();
        } catch (Exception e) {
            log.warn("Failed to format skills: {}", e.getMessage());
            return rawContent.toString();
        }
    }

    private String formatProjects(Object rawContent) {
        System.out.println(rawContent);
        try {
            if (!(rawContent instanceof List<?> projectsList)) {
                log.warn("formatProjects received invalid content: {}", rawContent);
                return "";
            }

            System.out.println("1 st condition done");

            List<ProjectDTO> projects = new ArrayList<>(projectsList.stream()
                    .filter(obj -> obj instanceof ProjectDTO)
                    .map(obj -> (ProjectDTO) obj)
                    .toList());

            System.out.println("wrapped into arraylist");

            if (projects.isEmpty())
                return "Project is empty";

            // Sort by score descending
            projects.sort((p1, p2) -> Integer.compare(scoreProject(p2), scoreProject(p1)));
            System.out.println("Sorting done");

            // Take top 3 projects
            List<ProjectDTO> topProjects = projects.size() > 3 ? projects.subList(0, 3) : projects;
            System.out.println("Picked top 3 projects" + topProjects);

            StringBuilder builder = new StringBuilder();

            System.out.println("Iteration begin");
            for (ProjectDTO project : topProjects) {
                builder.append("Project Name - ")
                        .append(project.getProjectName() != null ? project.getProjectName() : "")
                        .append("\n");

                builder.append("Github URL - ")
                        .append(project.getUrl() != null ? project.getUrl() : "")
                        .append("\n");

                builder.append("Project Description : ")
                        .append(project.getDescription() != null
                                ? project.getDescription().toLowerCase()
                                .replaceAll("[^a-z0-9\\s]", "")
                                .trim() : "")
                        .append("\n\n"); // Separate projects
            }
            System.out.println("Iteration done");

            System.out.println("Formatted projects " + builder.toString().trim());
            return builder.toString().trim();

        } catch (Exception e) {
            log.warn("Failed to format projects: {}", e.getMessage());
            return "";
        }
    }

    private int scoreProject(ProjectDTO project) {
        String desc = project.getDescription() != null ? project.getDescription().toLowerCase() : "";
        int score = desc.length(); // base score by length

        if (desc.contains("docker") || desc.contains("aws"))
            score += 50;
        if (desc.contains("ai") || desc.contains("machine learning"))
            score += 40;
        if (desc.contains("real-time"))
            score += 30;
        if (desc.contains("security"))
            score += 20;

        return score;
    }

    private String formatEducation(Object rawContent) {
        if (!(rawContent instanceof List<?> educationList)) {
            log.warn("formatEducation received invalid content: {}", rawContent);
            return "";
        }

        List<EducationDTO> educations = educationList.stream()
                .filter(obj -> obj instanceof EducationDTO)
                .map(obj -> (EducationDTO) obj)
                .toList();

        if (educations.isEmpty()) {
            return "";
        }

        StringBuilder builder = new StringBuilder();

        for (EducationDTO edu : educations) {
            builder.append("Institution: ")
                    .append(edu.getInstitution() != null ? edu.getInstitution() : "")
                    .append("\n");

            builder.append("Degree: ")
                    .append(edu.getDegree() != null ? edu.getDegree() : "")
                    .append("\n");

            builder.append("Field of Study: ")
                    .append(edu.getFieldOfStudy() != null ? edu.getFieldOfStudy() : "")
                    .append("\n");

            builder.append("Start Date: ")
                    .append(formatDate(edu.getStartDate(), false))
                    .append("\n");

            builder.append("End Date: ")
                    .append(edu.getEndDate())
                    .append("\n");

            builder.append("Grade: ")
                    .append(edu.getGrade() != null ? edu.getGrade() : "null")
                    .append("\n\n"); // Separate entries with a blank line
        }

        System.out.println("Formatted edu : " + builder.toString().trim());

        return builder.toString().trim();
    }

    private String formatWorkExperience(Object rawContent) {
        if (!(rawContent instanceof List<?> experienceList)) {
            log.warn("formatWorkExperience received invalid content: {}", rawContent);
            return "";
        }

        List<WorkExperienceDTO> experiences = experienceList.stream()
                .filter(obj -> obj instanceof WorkExperienceDTO)
                .map(obj -> (WorkExperienceDTO) obj)
                .toList();

        if (experiences.isEmpty()) {
            return "";
        }

        StringBuilder builder = new StringBuilder();

        for (WorkExperienceDTO exp : experiences) {
            builder.append("Company: ")
                    .append(exp.getCompanyName() != null ? exp.getCompanyName() : "")
                    .append("\n");

            builder.append("Position: ")
                    .append(exp.getPosition() != null ? exp.getPosition() : "")
                    .append("\n");

            builder.append("Start Date: ")
                    .append(formatDate(exp.getStartDate(), false))
                    .append("\n");

            builder.append("End Date: ")
                    .append(formatDate(exp.getEndDate(), exp.isCurrentlyWorking()))
                    .append("\n");

            builder.append("Description: ")
                    .append(exp.getDescription() != null ? exp.getDescription() : "null")
                    .append("\n\n"); // Separate entries with a blank line
        }

        System.out.println("Format work-exp : " + builder.toString().trim());

        return builder.toString().trim();
    }

    private String formatDate(LocalDate date, boolean currentlyWorking) {
        if (currentlyWorking) {
            return "Present";
        } else if (date != null) {
            return String.valueOf(date);
        }
        return "null";
    }

    private String sanitizeHtml(String html) {
        if (html == null)
            return "";
        // Remove Thymeleaf expressions and comments
        html = html.replaceAll(";", "").replaceAll("\\*","");
        html = html.replaceAll("&apos;", "'");
        html = html.replaceAll("&quot;", "\"\"");
        html = html.replaceAll("&gt", ">");
        html = html.replaceAll("&lt;", "<");
        html = html.replaceAll("&amp;", "&");
        html = html.replaceAll("\\.(html|js|css|json|xml|php|asp|aspx|jsp)\\b", ""); // add word boundary
        html = html.replaceAll("\\$\\{[^}]*}", ""); // more robust expression matcher
        html = html.replaceAll("<!--.*?-->", ""); // removes <!-- ... -->
        html = html.replaceAll("(?i)<!DOCTYPE[^>]*>", "");
        html = html.replaceAll("(?i)<html[^>]*>", "");
        html = html.replaceAll("(?i)</html>", "");
        html = html.replaceAll("(?i)<head[^>]*>.*?</head>", "");
        html = html.replaceAll("(?i)<body[^>]*>", "");
        html = html.replaceAll("(?i)</body>", "");
        return html.trim();
    }

    public String sanitizeAndValidateHtml(String html) {
        if (html == null || html.trim().isEmpty()) {
            return "html is empty";
        }
        try {
            // Use Jsoup to parse the raw HTML string
            Document doc = Jsoup.parseBodyFragment(html);
            System.out.println("After parsing: " + doc.body().html());

            /// Step 3: clean nested <ul> inside <li> properly
            doc.select("li").forEach(li -> {
                Elements uls = li.select("> ul"); // direct children only
                uls.forEach(ul -> {
                    // remove invalid siblings
                    assert ul.parent() != null;
                    if (!ul.parent().equals(li)) ul.remove();
                });
            });

            // Remove empty tags
            doc.select("strong:empty, li:empty, ul:empty").remove();

            doc.traverse(new NodeVisitor() {
                @Override
                public void head(@NotNull Node node, int depth) {
                    if (node instanceof TextNode textNode) {
                        String unescaped = Parser.unescapeEntities(textNode.getWholeText(), false);
                        textNode.text(unescaped);
                    }
                }
                @Override
                public void tail(@NotNull Node node, int depth) {}
            });

            // Use Jsoup's built-in cleaner with a strict safelist to ensure only allowed
            // tags are present
            Safelist safelist = Safelist.simpleText()
                    .addTags("ul", "li", "strong", "br", "p", "i", "em", "b")
                    .addAttributes("a", "href");

            String safeHtml = Jsoup.clean(doc.body().html(), safelist);
            safeHtml = sanitizeHtml(safeHtml);
            System.out.println("Cleaned sanitize and validate html before injecting to thymeleaf" + safeHtml.trim());
            // A final check to remove any remaining artifacts
            return safeHtml.trim();

        } catch (Exception e) {
            log.warn("HTML sanitization failed: {}", e.getMessage());
            // Fallback: return an empty string or a simple message to avoid template
            // rendering errors
            return "<ul><li>There was an issue processing this section.</li></ul>";
        }
    }
}
