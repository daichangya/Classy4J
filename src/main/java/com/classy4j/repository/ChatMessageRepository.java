package com.classy4j.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classy4j.model.ChatMessage;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderAndReceiverOrderByTimestampDesc(String sender, String receiver);
    List<ChatMessage> findByReceiverOrderByTimestampDesc(String receiver);
    List<ChatMessage> findByConversationIdOrderByTimestampAsc(Long conversationId);
} 