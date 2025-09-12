package com.resumeai.service;

import java.util.Map;

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
}
