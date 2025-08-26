package com.resumeai.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;

@Service
public class OllamaService {
    private final RestTemplate restTemplate;
    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";


    public OllamaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateText(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "model", "phi3:mini",
                "prompt", prompt,
                "stream", false // IMPORTANT: disable streaming so we get one JSON response
        );

        HttpEntity<Map<String, Object>> req = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> res = restTemplate.exchange(
                OLLAMA_URL,
                HttpMethod.POST,
                req,
                Map.class
        );

        if (res.getBody() != null && res.getBody().get("response") != null) {
            return res.getBody().get("response").toString().trim();
        }



        return "";
    }
}
