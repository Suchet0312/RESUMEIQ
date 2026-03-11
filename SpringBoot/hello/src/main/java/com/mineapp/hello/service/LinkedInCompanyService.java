package com.mineapp.hello.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

import com.mineapp.hello.dto.JobResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class LinkedInCompanyService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public LinkedInCompanyService(WebClient rapidApiWebClient) {
        this.webClient = rapidApiWebClient;
    }

    // ✅ THIS is what controller should call
    public List<JobResponseDto> searchJobs(
            String title,
            String location,
            int limit,
            int offset
    ) throws Exception {

        // 1️⃣ Call RapidAPI
        String rawJson = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/active-jb-24h")
                        .queryParam("limit", limit)
                        .queryParam("offset", offset)
                        .queryParam("title_filter", "\"" + title + "\"")
                        .queryParam("location_filter", "\"" + location + "\"")
                        .queryParam("description_type", "text")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // 2️⃣ Parse & clean
        return getCleanJobs(rawJson);
    }

    // 🔒 Internal helper
    private List<JobResponseDto> getCleanJobs(String rawJson) throws Exception {

        JsonNode root = mapper.readTree(rawJson);
        List<JobResponseDto> jobs = new ArrayList<>();

        for (JsonNode node : root) {
            JobResponseDto job = new JobResponseDto();

            job.setId(node.path("id").asText());
            job.setTitle(node.path("title").asText());
            job.setCompany(node.path("organization").asText());

            // Location (safe)
            JsonNode locations = node.path("locations_raw");
            if (locations.isArray() && locations.size() > 0) {
                JsonNode loc = locations.get(0).path("address");
                job.setLocation(
                        loc.path("addressLocality").asText() + ", " +
                        loc.path("addressRegion").asText() + ", " +
                        loc.path("addressCountry").asText()
                );
            }

            // Employment type
            JsonNode emp = node.path("employment_type");
            if (emp.isArray() && emp.size() > 0) {
                job.setEmploymentType(emp.get(0).asText());
            }

            // Salary (optional)
            JsonNode salary = node.path("salary");
            if (!salary.isMissingNode() && !salary.isNull()) {
                job.setSalary(
                        "$" +
                        salary.path("value").path("minValue").asText() +
                        " – $" +
                        salary.path("value").path("maxValue").asText() +
                        " / " +
                        salary.path("value").path("unitText").asText()
                );
            }

            job.setPostedDate(node.path("date_posted").asText());
            job.setApplyUrl(node.path("external_apply_url").asText());

            jobs.add(job);
        }

        return jobs;
    }
}
