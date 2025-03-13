package com.classy4j.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.classy4j.model.ChatMessage;
import com.classy4j.model.Conversation;
import com.classy4j.repository.ChatMessageRepository;
import com.classy4j.repository.ConversationRepository;
import com.classy4j.service.ConversationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private static final Logger logger = LoggerFactory.getLogger(ConversationServiceImpl.class);

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatServiceImpl chatService;

    @Override
    @Transactional
    public Conversation createConversation(Conversation conversation) {
        // 如果前端没有设置时间，则在后端设置
        LocalDateTime now = LocalDateTime.now();
        if (conversation.getCreatedAt() == null) {
            conversation.setCreatedAt(now);
        }
        if (conversation.getUpdatedAt() == null) {
            conversation.setUpdatedAt(now);
        }

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
    @Transactional
    public Conversation updateConversation(Long id, Conversation conversation) {
        Conversation existingConversation = getConversation(id);
        existingConversation.setTitle(conversation.getTitle());
        existingConversation.setParticipants(conversation.getParticipants());
        existingConversation.setUpdatedAt(LocalDateTime.now());
        return conversationRepository.save(existingConversation);
    }

    @Override
    @Transactional
    public void deleteConversation(Long id) {
        conversationRepository.deleteById(id);
    }

    @Override
    public List<ChatMessage> getConversationMessages(Long conversationId) {
        try {
            logger.info("正在获取会话 {} 的消息", conversationId);
            Conversation conversation = getConversation(conversationId);
            if (conversation == null) {
                logger.error("会话 {} 不存在", conversationId);
                throw new RuntimeException("会话不存在");
            }
            
            List<ChatMessage> messages = chatMessageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
            logger.info("成功获取会话 {} 的消息，共 {} 条", conversationId, messages.size());
            return messages;
        } catch (Exception e) {
            logger.error("获取会话 {} 的消息时发生错误: {}", conversationId, e.getMessage());
            throw new RuntimeException("获取会话消息失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void addMessageToConversation(Long conversationId, ChatMessage message) {
        Conversation conversation = getConversation(conversationId);
        LocalDateTime now = LocalDateTime.now();
        
        // 设置消息属性
        message.setConversationId(conversationId);
        message.setTimestamp(now);

        // 发送消息并获取AI响应
        ChatMessage aiResponse = chatService.sendMessage(message);
        if (aiResponse != null) {
            aiResponse.setConversationId(conversationId);
            // 更新会话状态
            conversation.setLastMessage(aiResponse.getContent());
            conversation.setLastMessageTime(aiResponse.getTimestamp());
            conversation.setUpdatedAt(aiResponse.getTimestamp());
        } else {
            // 如果没有AI响应，使用用户消息更新会话状态
            conversation.setLastMessage(message.getContent());
            conversation.setLastMessageTime(message.getTimestamp());
            conversation.setUpdatedAt(message.getTimestamp());
        }

        // 保存更新后的会话
        conversationRepository.save(conversation);
    }
} 