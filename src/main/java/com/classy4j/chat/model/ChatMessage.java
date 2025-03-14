package com.classy4j.chat.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String content;
    private String sender;
    private String receiver;
    private MessageType type;
    private LocalDateTime timestamp;

    private Long conversationId;
    
    public enum MessageType {
        CHAT,
        SYSTEM,
        TOOL_CALL,
        TOOL_RESPONSE
    }
} 