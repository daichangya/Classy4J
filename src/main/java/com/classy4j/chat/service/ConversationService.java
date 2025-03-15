package com.classy4j.chat.service;

import java.util.List;

import com.classy4j.chat.model.ChatMessage;
import com.classy4j.chat.model.Conversation;

import reactor.core.publisher.Flux;

public interface ConversationService {
    Conversation createConversation(Conversation conversation);
    Conversation getConversation(Long id);
    List<Conversation> getAllConversations();
    void deleteConversation(Long id);
    List<ChatMessage> getConversationMessages(Long conversationId);
    Flux<String> streamChatResponse(Long conversationId, ChatMessage message);
}