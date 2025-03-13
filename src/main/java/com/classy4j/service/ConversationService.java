package com.classy4j.service;

import java.util.List;

import com.classy4j.model.ChatMessage;
import com.classy4j.model.Conversation;

public interface ConversationService {
    Conversation createConversation(Conversation conversation);
    Conversation getConversation(Long id);
    List<Conversation> getAllConversations();
    Conversation updateConversation(Long id, Conversation conversation);
    void deleteConversation(Long id);
    List<ChatMessage> getConversationMessages(Long conversationId);
    void addMessageToConversation(Long conversationId, ChatMessage message);
} 