package com.mineapp.hello.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class ResumeAnalyzerService {

    public int calculateScore(String text) {
        int score = 0;
        String lower = text.toLowerCase();

        if (lower.contains("experience")) score += 20;
        if (lower.contains("education")) score += 15;
        if (lower.contains("skills")) score += 25;
        if (lower.contains("projects")) score += 10;

        if (lower.contains("@")) score += 10;
        if (lower.matches(".*\\d{10}.*")) score += 5;

        int wordCount = text.split("\\s+").length;
        if (wordCount > 300 && wordCount < 900) score += 15;

        return Math.min(score, 100);
    }
    public String analyzeResume(String fileUrl) {

    RestTemplate restTemplate = new RestTemplate();

    String fastApiUrl = "http://127.0.0.1:8001/analyze-resume";

    Map<String, String> request = Map.of(
            "resume_url", fileUrl
    );

    ResponseEntity<Map> response =
            restTemplate.postForEntity(
                    fastApiUrl,
                    request,
                    Map.class
            );

    return (String) response.getBody().get("analysis");
}

    public boolean isAtsFriendly(int score) {
        return score >= 60;
    }
}
