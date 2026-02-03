package com.yckim.portfolio.controller;

import com.yckim.portfolio.dto.ChatRequest;
import com.yckim.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final PortfolioService portfolioService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody ChatRequest request) {
        String response = portfolioService.generateChatResponse(
                request.getSessionId(),
                request.getMessage()
        );

        return ResponseEntity.ok(Map.of("response", response));
    }
}
