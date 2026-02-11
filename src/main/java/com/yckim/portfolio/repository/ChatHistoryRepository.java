package com.yckim.portfolio.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ChatHistoryRepository {
    private final StringRedisTemplate redisTemplate;

    public String getHistory(String sessionId) {
        if (sessionId == null) return "";
        List<String> history = redisTemplate.opsForList().range("chat:" + sessionId, 0, -1);
        return history != null ? String.join("\n", history) : "";
    }

    public void saveHistory(String sessionId, String userMsg, String aiMsg) {
        String key = "chat:" + sessionId;
        redisTemplate.opsForList().rightPushAll(key, "User: " + userMsg, "AI: " + aiMsg);
        redisTemplate.expire(key, Duration.ofHours(1));
    }
}