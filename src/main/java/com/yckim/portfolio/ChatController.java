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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatClient.Builder chatClientBuilder;
    private final VectorStore vectorStore;

    @Value("classpath:portfolio.txt")
    private Resource portfolioData;

    @PostConstruct
    public void init() {
        try {
            TextReader textReader = new TextReader(portfolioData);
            textReader.getCustomMetadata().put("charset", "UTF-8");

            List<Document> documents = textReader.get();
            if (documents.isEmpty()) {
                log.warn("⚠️ portfolio.txt 파일이 비어있습니다!");
            } else {
                vectorStore.add(documents);
                log.info("✅ Java 21 포트폴리오 데이터 {}건 로딩 완료!", documents.size());
            }
        } catch (Exception e) {
            log.error("❌ 데이터 로딩 중 에러 발생: ", e);
        }
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        log.info("📩 사용자 질문: {}", userMessage);

        // 🔍 1. 유사도 검색 (0.4로 완화)
        List<Document> similarDocs = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(userMessage)
                        .topK(3)
                        .similarityThreshold(0.4)
                        .build()
        );

        // 🔍 2. [디버깅] 콘솔 출력 (여기서 getText()로 수정됨!)
        System.out.println("================= 검색 결과 =================");
        System.out.println("검색된 문서 개수: " + similarDocs.size());
        for (Document doc : similarDocs) {
            // 🔴 수정된 부분: getContent() -> getText()
            String text = doc.getText();
            System.out.println("📄 내용: " + text.replace("\n", " ").substring(0, Math.min(text.length(), 50)) + "...");
        }
        System.out.println("===========================================");

        if (similarDocs.isEmpty()) {
            return Map.of("response", "죄송합니다. 제 포트폴리오 데이터에서 관련된 내용을 찾을 수 없습니다.");
        }

        // 🔴 수정된 부분: Document::getContent -> Document::getText
        String context = similarDocs.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n"));

        String prompt = """
                [역할]
                너는 개발자 '김연철(예시)'의 포트폴리오를 소개하는 AI 면접관 도우미야.
                
                [지침]
                1. 아래 제공된 [정보]에 있는 내용만 가지고 대답해.
                2. [정보]에 없는 내용은 절대 지어내지 말고, "죄송하지만 해당 정보는 포트폴리오에 없습니다."라고 말해.
                3. 말투는 정중하고 전문적인 '해요체'를 사용해.

                [정보]
                %s

                [질문]
                %s
                
                [답변]
                """.formatted(context, userMessage);

        ChatClient chatClient = chatClientBuilder.build();
        String response = chatClient.prompt(prompt).call().content();

        return Map.of("response", response);
    }
}