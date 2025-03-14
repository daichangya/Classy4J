package com.classy4j.chat.service;

import java.util.List;

import com.classy4j.chat.model.ChatMessage;

public interface ChatService {
    ChatMessage sendMessage(ChatMessage message);
    List<ChatMessage> getMessageHistory(String sender, String receiver);
    void processAiResponse(ChatMessage message);
} 