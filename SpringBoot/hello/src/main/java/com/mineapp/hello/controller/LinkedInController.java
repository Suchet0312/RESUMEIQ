package com.mineapp.hello.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.mineapp.hello.dto.JobResponseDto;
import com.mineapp.hello.service.LinkedInCompanyService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.*;

@RestController
@RequestMapping("/api/linkedin")
public class LinkedInController {

    private final LinkedInCompanyService jobService;

    public LinkedInController(LinkedInCompanyService jobService) {
        this.jobService = jobService;
    }

@GetMapping("/jobs")
public List<JobResponseDto> jobs(
        @RequestParam String title,
        @RequestParam String location
) throws Exception {
    return jobService.searchJobs(title, location, 10, 0);
}

}