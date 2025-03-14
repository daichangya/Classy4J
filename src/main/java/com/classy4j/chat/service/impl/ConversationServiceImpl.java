package com.classy4j.chat.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.classy4j.chat.model.ChatMessage;
import com.classy4j.chat.model.Conversation;
import com.classy4j.chat.repository.ChatMessageRepository;
import com.classy4j.chat.repository.ConversationRepository;
import com.classy4j.chat.service.ChatService;
import com.classy4j.chat.service.ConversationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatService chatService;

    @Override
    public Conversation createConversation(Conversation conversation) {
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setUpdatedAt(LocalDateTime.now());
        return conversationRepository.save(conversation);
    }

    @Override
    public Conversation getConversation(Long id) {
        return conversationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("会话不存在"));
    }

    @Override
    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    @Override
    public Conversation updateConversation(Long id, Conversation conversation) {
        Conversation existingConversation = getConversation(id);
        existingConversation.setTitle(conversation.getTitle());
        existingConversation.setParticipants(conversation.getParticipants());
        existingConversation.setUpdatedAt(LocalDateTime.now());
        return conversationRepository.save(existingConversation);
    }

    @Override
    public void deleteConversation(Long id) {
        conversationRepository.deleteById(id);
    }

    @Override
    public List<ChatMessage> getConversationMessages(Long conversationId) {
        // 验证会话是否存在
        getConversation(conversationId);
        // 获取会话的所有消息
        return chatMessageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    @Override
    public void addMessageToConversation(Long conversationId, ChatMessage message) {
        // 验证会话是否存在
        Conversation conversation = getConversation(conversationId);
        
        // 设置消息的会话ID
        message.setConversationId(conversationId);
        
        // 发送消息（这会同时保存消息并处理AI响应）
        ChatMessage savedMessage = chatService.sendMessage(message);
        
        // 更新会话的最后消息信息
        conversation.setLastMessage(savedMessage.getContent());
        conversation.setLastMessageTime(savedMessage.getTimestamp());
        conversation.setUpdatedAt(LocalDateTime.now());
        
        conversationRepository.save(conversation);
    }
} 