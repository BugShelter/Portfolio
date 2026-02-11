package com.yckim.portfolio.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.reader.JsonReader;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class VectorDataService {
    private final VectorStore vectorStore;
    @Value("classpath:portfolio.json")
    private Resource portfolioData;

    @PostConstruct
    public void init() {
        try {
            JsonReader jsonReader = new JsonReader(portfolioData, "text");
            vectorStore.add(jsonReader.get());
        } catch (Exception e) {
            log.error("ERROR: Failed to load portfolio data", e);
        }
    }
}