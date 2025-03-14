package com.classy4j.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classy4j.chat.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
} 