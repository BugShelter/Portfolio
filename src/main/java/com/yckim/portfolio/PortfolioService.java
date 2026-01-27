package com.yckim.portfolio.service;

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
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final ChatClient.Builder chatClientBuilder;
    private final VectorStore vectorStore;
    private final StringRedisTemplate redisTemplate;

    @Value("classpath:portfolio.txt")
    private Resource portfolioData;

    /**
     * 앱 시작 시 포트폴리오 텍스트 파일을 벡터 스토어에 로드
     */
    @PostConstruct
    public void init() {
        try {
            TextReader textReader = new TextReader(portfolioData);
            textReader.getCustomMetadata().put("charset", "UTF-8");
            List<Document> documents = textReader.get();
            if (!documents.isEmpty()) {
                vectorStore.add(documents);
                log.info("✅ SUCCESS: Portfolio data indexed in VectorStore");
            }
        } catch (Exception e) {
            log.error("❌ ERROR: Failed to load portfolio data", e);
        }
    }

    /**
     * 채팅 메인 로직
     */
    public String generateChatResponse(String sessionId, String userMessage) {
        // 1. Redis에서 이전 대화 내역 가져오기
        String history = getChatHistory(sessionId);

        // 2. 벡터 스토어에서 유사 문서 검색 (RAG)
        List<Document> similarDocs = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(userMessage)
                        .topK(3)
                        .similarityThreshold(0.4)
                        .build()
        );

        if (similarDocs.isEmpty()) {
            return "죄송합니다. 해당 질문에 대한 정보를 포트폴리오에서 찾을 수 없습니다.";
        }

        String context = similarDocs.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n"));

        // 3. AI에게 질문 던지기
        String response = callAiModel(history, context, userMessage);

        // 4. 새로운 대화 내용 Redis 저장
        saveChatHistory(sessionId, userMessage, response);

        return response;
    }

    private String getChatHistory(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) return "";
        List<String> historyList = redisTemplate.opsForList().range("chat:" + sessionId, 0, -1);
        return (historyList != null) ? String.join("\n", historyList) : "";
    }

    private void saveChatHistory(String sessionId, String userMsg, String aiMsg) {
        if (sessionId == null || sessionId.isBlank()) return;
        String key = "chat:" + sessionId;
        redisTemplate.opsForList().rightPush(key, "User: " + userMsg);
        redisTemplate.opsForList().rightPush(key, "AI: " + aiMsg);
        redisTemplate.expire(key, Duration.ofHours(1)); // 1시간 유지
    }

    private String callAiModel(String history, String context, String userMsg) {
        String prompt = """
                [역할] 너는 개발자 김연철의 포트폴리오 전용 AI 어시스턴트야.
                [맥락] 이전 대화 내용: %s
                [참고 정보] 포트폴리오 데이터: %s
                [질문] 사용자: %s
                [지침] 제공된 정보만 바탕으로 친절하게 답변해줘. 모르는 내용은 억지로 꾸며내지 마.
                """.formatted(history, context, userMsg);

        return chatClientBuilder.build()
                .prompt(prompt)
                .call()
                .content();
    }
}
