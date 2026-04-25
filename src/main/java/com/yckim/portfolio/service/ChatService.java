package com.yckim.portfolio.service;

import com.yckim.portfolio.repository.ChatHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatClient geminiChatClient;
    private final ChatClient ollamaChatClient;
    private final VectorStore vectorStore;
    private final ChatHistoryRepository historyRepository;

    private static final int MAX_CACHE_SIZE = 100;
    private final Map<String, String> exactMatchCache = Collections.synchronizedMap(
            new LinkedHashMap<String, String>(MAX_CACHE_SIZE, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
                    return size() > MAX_CACHE_SIZE;
                }
            }
    );

    public String generateChatResponse(String sessionId, String rawUserMessage) {
        String userMessage = rawUserMessage != null ? rawUserMessage.trim() : "";
        String history = historyRepository.getHistory(sessionId);

        String searchQuery = userMessage;
        if (!history.isBlank()) {
            String rewritePrompt = """
                    다음 대화 기록을 참고해서, 마지막 사용자의 질문을 대명사(그, 저, 이것 등)가 없는 완전하고 독립적인 질문으로 형식을 변환해서 다시 써줘.
                    문맥상 변경할 필요가 없으면 부가 설명 없이 원래 질문을 꼭 그대로 반환해.
                    만약 질문이 대화 기록과 무관하다면, 부가 설명 없이 원래 질문을 그대로 반환해.
                    [대화 기록]: %s
                    [마지막 질문]: %s
                    [독립적인 질문]:""".formatted(history, userMessage);
            searchQuery = callWithFallback(rewritePrompt).trim();
        }

        if (exactMatchCache.containsKey(searchQuery)) {
            return exactMatchCache.get(searchQuery);
        }

        List<Document> cachedDocs = Collections.emptyList();
        try {
            cachedDocs = vectorStore.similaritySearch(
                    SearchRequest.builder()
                            .query(searchQuery)
                            .topK(1)
                            .similarityThreshold(0.85)
                            .filterExpression("type == 'cache'")
                            .build()
            );
        } catch (Exception e) {
            System.err.println("VectorStore cache search failed (Network/API issue): " + e.getMessage());
        }

        if (!cachedDocs.isEmpty()) {
            String cachedAnswer = (String) cachedDocs.get(0).getMetadata().get("answer");
            exactMatchCache.put(searchQuery, cachedAnswer);
            return cachedAnswer;
        }

        List<Document> docs = Collections.emptyList();
        try {
            docs = vectorStore.similaritySearch(
                    SearchRequest.builder().query(searchQuery).topK(5).build()
            );
        } catch (Exception e) {
            System.err.println("VectorStore similarity search failed (Network/API issue): " + e.getMessage());
        }

        String context = docs.stream()
                .filter(doc -> !"cache".equals(doc.getMetadata().get("type")))
                .limit(3)
                .map(Document::getText)
                .collect(Collectors.joining("\n"));

        String prompt = """
                [역할] 너는 개발자의 포트폴리오 전용 AI 어시스턴트야.
                [맥락] 이전 대화 내용: %s
                [참고 정보] 포트폴리오 데이터: %s
                [질문] 사용자: %s
                [지침] 제공된 정보만 바탕으로 친절하게 답변해줘. 모르는 내용은 억지로 꾸며내지 마.
                """.formatted(history, context, userMessage);

        String response = callWithFallback(prompt);

        try {
            Document cacheDoc = new Document(
                    searchQuery,
                    Map.of("type", "cache", "answer", response)
            );
            vectorStore.add(List.of(cacheDoc));
        } catch (Exception e) {
            System.err.println("VectorStore cache save failed: " + e.getMessage());
        }
        exactMatchCache.put(searchQuery, response);

        historyRepository.saveHistory(sessionId, userMessage, response);

        return response;
    }

    private String callWithFallback(String prompt) {
        try {
            return geminiChatClient.prompt().user(prompt).call().content();
        } catch (Exception e) {
            return ollamaChatClient.prompt().user(prompt).call().content();
        }
    }
}
