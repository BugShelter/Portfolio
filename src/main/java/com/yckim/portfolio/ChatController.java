package com.yckim.portfolio;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatClient.Builder chatClientBuilder;
    private final VectorStore vectorStore;

    // 🟢 Redis 사용을 위한 템플릿 추가
    private final StringRedisTemplate redisTemplate;

    @Value("classpath:portfolio.txt")
    private Resource portfolioData;

    @PostConstruct
    public void init() {
        try {
            TextReader textReader = new TextReader(portfolioData);
            textReader.getCustomMetadata().put("charset", "UTF-8");
            List<Document> documents = textReader.get();
            if (!documents.isEmpty()) {
                vectorStore.add(documents);
                log.info("SUCCESS: Load Data");
            }
        } catch (Exception e) {
            log.error("ERROR - Failed to load data :", e);
        }
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String sessionId = request.get("sessionId");

        log.info("{}> ", sessionId, userMessage);

        String history = "";
        if (sessionId != null && !sessionId.isEmpty()) {
            List<String> historyList = redisTemplate.opsForList().range("chat:" + sessionId, 0, -1);
            if (historyList != null && !historyList.isEmpty()) {
                history = String.join("\n", historyList);
            }
        }

        List<Document> similarDocs = vectorStore.similaritySearch(
                SearchRequest.builder().query(userMessage).topK(3).similarityThreshold(0.4).build()
        );

        if (similarDocs.isEmpty()) {
            return Map.of("response", "죄송합니다. 포트폴리오 정보에서 찾을 수 없습니다.");
        }

        String context = similarDocs.stream().map(Document::getText).collect(Collectors.joining("\n"));

        // 3. 프롬프트 구성 (이전 대화 기록 history 포함!)
        String prompt = """
                [역할]
                너는 개발자 김연철의 포트폴리오를 소개하는 AI야.
                
                [이전 대화 기록]
                %s

                [포트폴리오 정보]
                %s

                [사용자 질문]
                %s
                
                [지침]
                정보에 기반해서 답변해. 이전 대화 맥락을 고려해.
                """.formatted(history, context, userMessage);

        ChatClient chatClient = chatClientBuilder.build();
        String response = chatClient.prompt(prompt).call().content();

        if (sessionId != null && !sessionId.isEmpty()) {
            String key = "chat:" + sessionId;
            redisTemplate.opsForList().rightPush(key, "User: " + userMessage);
            redisTemplate.opsForList().rightPush(key, "AI: " + response);
            redisTemplate.expire(key, Duration.ofHours(1));
        }

        return Map.of("response", response);
    }
}
