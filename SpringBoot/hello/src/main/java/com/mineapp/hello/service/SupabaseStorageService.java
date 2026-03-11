package com.mineapp.hello.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}") // MUST be service_role key
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    public String uploadFile(MultipartFile file) throws Exception {

        System.out.println("📁 Uploading file to Supabase...");

        String originalName = file.getOriginalFilename();
        String safeName = originalName.replaceAll("[^a-zA-Z0-9.\\-]", "_");
        String fileName = UUID.randomUUID() + "_" + safeName;

        String uploadUrl =
                supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

        WebClient webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseKey)
                .defaultHeader("apikey", supabaseKey)
                .defaultHeader("x-upsert", "true")
                .build();

        webClient.post()
                .uri(uploadUrl)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .bodyValue(file.getBytes())
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class)
                                .map(err -> new RuntimeException("Supabase error: " + err))
                )
                .bodyToMono(Void.class)
                .block();

        System.out.println("✅ File uploaded successfully");

        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
    }
}
