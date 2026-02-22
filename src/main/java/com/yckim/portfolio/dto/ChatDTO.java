package com.yckim.portfolio.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatDTO {
    @Size(max = 1000, message = "메시지는 1000자를 초과할 수 없습니다.")
    private String message;
    private String sessionId;
}
