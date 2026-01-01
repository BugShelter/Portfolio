package com.yckim.portfolio;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatClient.Builder chatClientBuilder;
    private final VectorStore vectorStore;

    @Value("classpath:portfolio.txt")
    private Resource portfolioData;

    @PostConstruct
    public void init() {
        TextReader textReader = new TextReader(portfolioData);
        vectorStore.add(textReader.get());
        System.out.println("✅ Java 21 포트폴리오 데이터 로딩 완료!");
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        List<Document> similarDocs = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(userMessage)
                        .topK(3)
                        .similarityThreshold(0.6)
                        .build()
        );

        String context = similarDocs.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n"));

        String prompt = """
                정보: %s
                질문: %s
                위 정보를 바탕으로 면접관에게 답변하듯이 정중하게 대답해줘.
                """.formatted(context, userMessage);

        ChatClient chatClient = chatClientBuilder.build();
        String response = chatClient.prompt(prompt).call().content();

        return Map.of("response", response);
    }
}
