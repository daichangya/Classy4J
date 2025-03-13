package com.classy4j.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classy4j.model.Conversation;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
} 