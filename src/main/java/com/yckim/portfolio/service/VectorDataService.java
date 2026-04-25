package com.yckim.portfolio.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections.PayloadSchemaType;

@Service
@Slf4j
@RequiredArgsConstructor
public class VectorDataService {
    private final VectorStore vectorStore;
    private final QdrantClient qdrantClient;

    @Value("classpath:portfolio.txt")
    private Resource portfolioData;

    @Value("${spring.ai.vectorstore.qdrant.collection-name:portfolio}")
    private String collectionName;

    @PostConstruct
    public void init() {
        try {
            qdrantClient.createPayloadIndexAsync(
                    collectionName,
                    "type",
                    PayloadSchemaType.Keyword,
                    null,
                    null,
                    null,
                    null
            ).get();
            log.info("Qdrant payload index for 'type' checked/created successfully.");
        } catch (Exception e) {
            log.warn("Qdrant payload index creation skipped or already exists: {}", e.getMessage());
        }
        try {
            TextReader textReader = new TextReader(portfolioData);
            textReader.getCustomMetadata().put("charset", "UTF-8");
            vectorStore.add(textReader.get());
        } catch (Exception e) {
            log.error("ERROR: Failed to load portfolio data", e);
        }
    }
}
