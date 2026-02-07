package com.yckim.portfolio.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class ChatClientConfig {

    /**
     * Gemini용 ChatClient
     * spring-ai-google-genai 스타터가 등록한 ChatModel을 가져옵니다.
     * 혹시 모를 충돌 방지를 위해 이를 Primary(기본값)로 설정합니다.
     */
    @Bean
    @Primary
    public ChatClient geminiChatClient(@Qualifier("googleGenAiChatModel") ChatModel chatModel) {
        return ChatClient.create(chatModel);
    }

    /**
     * Ollama용 ChatClient
     * spring-ai-ollama 스타터가 등록한 ChatModel을 가져옵니다.
     */
    @Bean
    public ChatClient ollamaChatClient(@Qualifier("ollamaChatModel") ChatModel chatModel) {
        return ChatClient.create(chatModel);
    }

    @Bean
    @Primary
    public EmbeddingModel primaryEmbeddingModel(@Qualifier("googleGenAiTextEmbedding") EmbeddingModel geminiEmbedding) {
        return geminiEmbedding;
    }
}