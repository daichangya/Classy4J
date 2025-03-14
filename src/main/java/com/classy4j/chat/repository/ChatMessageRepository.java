package com.classy4j.chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classy4j.chat.model.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderAndReceiverOrderByTimestampDesc(String sender, String receiver);
    List<ChatMessage> findByReceiverOrderByTimestampDesc(String receiver);
    List<ChatMessage> findByConversationIdOrderByTimestampAsc(Long conversationId);
} 