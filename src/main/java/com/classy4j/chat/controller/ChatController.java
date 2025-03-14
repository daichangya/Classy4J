package com.classy4j.chat.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.classy4j.chat.model.ChatMessage;
import com.classy4j.chat.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send")
    public ChatMessage sendMessage(@RequestBody ChatMessage message) {
        return chatService.sendMessage(message);
    }

    @GetMapping("/history")
    public List<ChatMessage> getMessageHistory(
            @RequestParam String sender,
            @RequestParam String receiver) {
        return chatService.getMessageHistory(sender, receiver);
    }

    @MessageMapping("/websocket/send")
    public void handleWebSocketMessage(@Payload ChatMessage message) {
        ChatMessage response = chatService.sendMessage(message);
        messagingTemplate.convertAndSend("/topic/chat/" + message.getReceiver(), response);
    }
} 