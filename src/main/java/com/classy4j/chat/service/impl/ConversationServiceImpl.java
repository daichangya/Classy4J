package com.classy4j.chat.service.impl;

import java.time.Duration;
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
import reactor.core.publisher.Flux;

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
    public Flux<String> streamChatResponse(Long conversationId, ChatMessage message) {
        // 验证会话是否存在
        getConversation(conversationId);
        
        // 设置消息的会话ID
        message.setConversationId(conversationId);
        // 模拟AI响应，实际项目中应该调用AI服务
        String response = "这是一个模拟的AI响应，用于测试流式输出功能。现在我们正在一个字一个字地输出这段文字，以模拟真实的AI响应过程。";
        return Flux.fromArray(response.split(""))
                .delayElements(Duration.ofMillis(100));
    }
}