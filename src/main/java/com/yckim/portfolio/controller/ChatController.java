package com.yckim.portfolio.controller;

import com.yckim.portfolio.dto.ChatDTO;
import com.yckim.portfolio.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody ChatDTO request) {
        String response = chatService.generateChatResponse(
                request.getSessionId(),
                request.getMessage()
        );
        return ResponseEntity.ok(Map.of("response", response));
    }
}