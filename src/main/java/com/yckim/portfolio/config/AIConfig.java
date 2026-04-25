package com.yckim.portfolio.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;

import java.lang.reflect.Proxy;
import java.lang.reflect.InvocationTargetException;

@Configuration
public class AIConfig {
    @Bean @Primary
    public ChatClient geminiChatClient(@Qualifier("googleGenAiChatModel") ChatModel chatModel) {
        return ChatClient.create(chatModel);
    }

    @Bean
    public ChatClient ollamaChatClient(@Qualifier("ollamaChatModel") ChatModel chatModel) {
        return ChatClient.create(chatModel);
    }

    @Bean @Primary
    public EmbeddingModel primaryEmbeddingModel(
            @Qualifier("googleGenAiTextEmbedding") EmbeddingModel geminiEmbedding,
            @Qualifier("ollamaEmbeddingModel") EmbeddingModel ollamaEmbedding) {

        return (EmbeddingModel) Proxy.newProxyInstance(
                EmbeddingModel.class.getClassLoader(),
                new Class[]{EmbeddingModel.class},
                (proxy, method, args) -> {
                    try {
                        return method.invoke(geminiEmbedding, args);
                    } catch (InvocationTargetException e) {
                        System.err.println("🚨 Gemini 임베딩 실패! Ollama로 Fallback 시도 중...: " + e.getTargetException().getMessage());
                        return method.invoke(ollamaEmbedding, args);
                    }
                }
        );
    }
}
