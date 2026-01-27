package com.yckim.portfolio.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatRequest {
    private String message;
    private String sessionId;
}
