package com.mineapp.hello.controller;

import com.mineapp.hello.model.Resume;
import com.mineapp.hello.repository.ResumeRepository;
import com.mineapp.hello.service.ResumeAnalyzerService;
import com.mineapp.hello.service.ResumeTextExtractor;
import com.mineapp.hello.service.SupabaseStorageService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final SupabaseStorageService storageService;
    private final ResumeRepository resumeRepository;
    private final ResumeTextExtractor textExtractor;
    private final ResumeAnalyzerService analyzer;

    public ResumeController(
            SupabaseStorageService storageService,
            ResumeRepository resumeRepository,
            ResumeTextExtractor textExtractor,
            ResumeAnalyzerService analyzer
    ) {
        this.storageService = storageService;
        this.resumeRepository = resumeRepository;
        this.textExtractor = textExtractor;
        this.analyzer = analyzer;
    }

       @PostMapping("/upload")
public ResponseEntity<?> uploadResume(
        @RequestParam("file") MultipartFile file,
        Authentication authentication
) {
    if (file.isEmpty()) {
        return ResponseEntity.badRequest().body("File is empty");
    }

    try {
        // 🔐 Get email from JWT
        String email = authentication.getName();

        System.out.println("👤 Authenticated user: " + email);
        System.out.println("📄 File name: " + file.getOriginalFilename());
        System.out.println("📦 File size: " + file.getSize());
        System.out.println("⬆️ Uploading file to Supabase...");

        // 1️⃣ Upload to Supabase
        String fileUrl = storageService.uploadFile(file);
        System.out.println("✅ File uploaded successfully: " + fileUrl);

        // 2️⃣ Extract text
        String text = textExtractor.extractText(file);

        // 3️⃣ Analyze resume
        int score = analyzer.calculateScore(text);
        boolean atsFriendly = analyzer.isAtsFriendly(score);

        // 4️⃣ Save metadata
        Resume resume = new Resume();
        resume.setUserEmail(email);
        resume.setFileUrl(fileUrl);
        resume.setScore(score);
        resume.setAtsFriendly(atsFriendly);

        resumeRepository.save(resume);
        System.out.println("💾 Resume metadata saved to DB");

        // 5️⃣ Send response
        return ResponseEntity.ok(
                Map.of(
                        "fileUrl", fileUrl,
                        "score", score,
                        "atsFriendly", atsFriendly
                )
        );

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body(Map.of("error", e.getMessage()));
    }
}
@GetMapping("/latest")
public ResponseEntity<?> getLatestResume(Authentication authentication) {

    String email = authentication.getName();
    System.out.println("👤 Fetching latest resume for: " + email);

    return resumeRepository
            .findTopByUserEmailOrderByCreatedAtDesc(email)
            .map(resume -> ResponseEntity.ok(
                    Map.of(
                        "score", resume.getScore(),
                        "atsFriendly", resume.getAtsFriendly(),
                        "fileUrl", resume.getFileUrl()
                    )
            ))
            .orElse(ResponseEntity.ok(
                    Map.of(
                        "score", 0,
                        "atsFriendly", false
                    )
            ));
}
@GetMapping("/history")
public ResponseEntity<?> getResumeHistory(Authentication authentication) {

    String email = authentication.getName(); // comes from JWT subject
    System.out.println("📜 Fetching resume history for: " + email);

    return ResponseEntity.ok(
            resumeRepository.findByUserEmailOrderByCreatedAtDesc(email)
    );
}

@PostMapping("/analyze")
public ResponseEntity<?> analyzeResume(Authentication authentication) {

    String email = authentication.getName();
    System.out.println("🤖 Running AI analysis for: " + email);

    Resume resume = resumeRepository
            .findTopByUserEmailOrderByCreatedAtDesc(email)
            .orElseThrow(() -> new RuntimeException("No resume found"));

    String analysis = analyzer.analyzeResume(resume.getFileUrl());

    return ResponseEntity.ok(
            Map.of(
                    "analysis", analysis,
                    "fileUrl", resume.getFileUrl()
            )
    );
}

}
