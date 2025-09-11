package com.resumeai.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;

import java.util.Map;

@Service
public class OllamaService {
    private final RestTemplate restTemplate;

    @Value("${OLLAMA_BASE_URL}")
    private String OLLAMA_URL;

    private static final int MAX_RETRIES = 5;
    private static final long RETRY_DELAY_MS = 2000;

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
                "stream", false // IMPORTANT: disable streaming so we get one JSON response
        );

        HttpEntity<Map<String, Object>> req = new HttpEntity<>(requestBody, headers);

        int attempts = 0;
        // Tries 5 times with 2-second delays if Ollama isn’t ready.
        while (attempts < MAX_RETRIES) {
            try {
                ResponseEntity<Map> res = restTemplate.exchange(
                        OLLAMA_URL,
                        HttpMethod.POST,
                        req,
                        Map.class);

                if (res.getBody() != null && res.getBody().get("response") != null) {
                    return res.getBody().get("response").toString().trim();
                }
                return "";
            } catch (Exception e) {
                attempts++;
                if (attempts >= MAX_RETRIES) {
                    throw new RuntimeException("Ollama service unavailable after retries", e);
                }
                try {
                    Thread.sleep(RETRY_DELAY_MS);
                } catch (InterruptedException ignored) {
                }
            }
        }
        return "";
    }
}
