package com.yckim.portfolio.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class VectorDataService {
    private final VectorStore vectorStore;
    @Value("classpath:portfolio.txt")
    private Resource portfolioData;

    @PostConstruct
    public void init() {
        try {
            TextReader textReader = new TextReader(portfolioData);
            textReader.getCustomMetadata().put("charset", "UTF-8");
            vectorStore.add(textReader.get());
        } catch (Exception e) {
            log.error("ERROR: Failed to load portfolio data", e);
        }
    }
}