package com.yckim.portfolio.service;

import com.yckim.portfolio.repository.ChatHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatClient geminiChatClient;
    private final ChatClient ollamaChatClient;
    private final VectorStore vectorStore;
    private final ChatHistoryRepository historyRepository;

    public String generateChatResponse(String sessionId, String userMessage) {
        // 1. 맥락 파악 (History + Vector Search)
        String history = historyRepository.getHistory(sessionId);
        List<Document> docs = vectorStore.similaritySearch(
                SearchRequest.builder().query(userMessage).topK(3).build()
        );
        String context = docs.stream().map(Document::getText).collect(Collectors.joining("\n"));

        // 2. 프롬프트 생성 및 AI 호출
        String prompt = """
                [역할] 너는 개발자 김연철의 포트폴리오 전용 AI 어시스턴트야.
                [맥락] 이전 대화 내용: %s
                [참고 정보] 포트폴리오 데이터: %s
                [질문] 사용자: %s
                [지침] 제공된 정보만 바탕으로 친절하게 답변해줘. 모르는 내용은 억지로 꾸며내지 마.
                """.formatted(history, context, userMessage);
        String response = callWithFallback(prompt);

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