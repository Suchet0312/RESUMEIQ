package com.mineapp.hello.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class RapidApiConfig {
    @Bean
    public WebClient rapidApiWebClient(
            @Value("${rapidapi.key}") String key,
            @Value("${rapidapi.host}") String host,
            @Value("${rapidapi.base-url}") String baseUrl
    ) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-RapidAPI-Key", key)
                .defaultHeader("X-RapidAPI-Host", host)
                .build();
    }
}
