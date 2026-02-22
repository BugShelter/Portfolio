package com.yckim.portfolio.controller;

import com.yckim.portfolio.dto.ChatDTO;
import com.yckim.portfolio.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@Valid @RequestBody ChatDTO request) {
        String response = chatService.generateChatResponse(
                request.getSessionId(),
                request.getMessage()
        );
        return ResponseEntity.ok(Map.of("response", response));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.ok(Map.of("response", errorMessage));
    }
}