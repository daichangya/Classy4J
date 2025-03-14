package com.classy4j.chat.service;

import java.util.List;

import com.classy4j.chat.model.ChatMessage;
import com.classy4j.chat.model.Conversation;

public interface ConversationService {
    Conversation createConversation(Conversation conversation);
    Conversation getConversation(Long id);
    List<Conversation> getAllConversations();
    Conversation updateConversation(Long id, Conversation conversation);
    void deleteConversation(Long id);
    List<ChatMessage> getConversationMessages(Long conversationId);
    void addMessageToConversation(Long conversationId, ChatMessage message);
} 