package com.classy4j.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classy4j.model.ChatMessage;
import com.classy4j.model.Conversation;
import com.classy4j.service.ConversationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ConversationController {

    private static final Logger logger = LoggerFactory.getLogger(ConversationController.class);

    private final ConversationService conversationService;

    @PostMapping("create")
    public Conversation createConversation(@RequestBody Conversation conversation) {
        return conversationService.createConversation(conversation);
    }

    @GetMapping("/{id}")
    public Conversation getConversation(@PathVariable Long id) {
        return conversationService.getConversation(id);
    }

    @GetMapping("/getAll")
    public List<Conversation> getAllConversations() {
        return conversationService.getAllConversations();
    }

    @PutMapping("/{id}")
    public Conversation updateConversation(@PathVariable Long id, @RequestBody Conversation conversation) {
        return conversationService.updateConversation(id, conversation);
    }

    @DeleteMapping("/{id}")
    public void deleteConversation(@PathVariable Long id) {
        conversationService.deleteConversation(id);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<?> getConversationMessages(@PathVariable Long id) {
        try {
            logger.info("接收到获取会话 {} 消息的请求", id);
            List<ChatMessage> messages = conversationService.getConversationMessages(id);
            logger.info("成功获取会话 {} 的消息", id);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("获取会话 {} 消息时发生错误: {}", id, e.getMessage());
            return ResponseEntity.status(500)
                .body(new ErrorResponse("获取会话消息失败", e.getMessage()));
        }
    }

    @PostMapping("/{id}/messages")
    public void addMessageToConversation(@PathVariable Long id, @RequestBody ChatMessage message) {
        conversationService.addMessageToConversation(id, message);
    }
}

class ErrorResponse {
    private String message;
    private String details;

    public ErrorResponse(String message, String details) {
        this.message = message;
        this.details = details;
    }

    // Getters
    public String getMessage() { return message; }
    public String getDetails() { return details; }
} 