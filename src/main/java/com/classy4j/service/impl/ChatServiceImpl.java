package com.classy4j.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.classy4j.model.ChatMessage;
import com.classy4j.repository.ChatMessageRepository;
import com.classy4j.service.ChatService;

import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatLanguageModel chatModel;

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        ChatMessage savedMessage = chatMessageRepository.save(message);
        // 如果接收者是AI，处理AI响应
        if ("ai".equals(message.getReceiver())) {
            processAiResponse(message);
        }
        
        return savedMessage;
    }

    @Override
    public List<ChatMessage> getMessageHistory(String sender, String receiver) {
        // 获取双向对话历史（包括用户发送的消息和AI的响应）
        List<ChatMessage> sentMessages = chatMessageRepository.findBySenderAndReceiverOrderByTimestampDesc(sender, receiver);
        List<ChatMessage> receivedMessages = chatMessageRepository.findBySenderAndReceiverOrderByTimestampDesc(receiver, sender);
        
        // 合并两个列表
        List<ChatMessage> allMessages = new ArrayList<>();
        allMessages.addAll(sentMessages);
        allMessages.addAll(receivedMessages);

        // 按时间戳升序排序
        allMessages.sort((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()));

        
        return allMessages;
    }

    @Override
    public void processAiResponse(ChatMessage message) {
        try {
            // 使用LangChain4j处理AI响应
            String response = chatModel.generate(message.getContent());
            
            // 创建并保存AI的响应消息
            ChatMessage aiResponse = new ChatMessage();
            aiResponse.setConversationId(message.getConversationId());
            aiResponse.setSender("ai");
            aiResponse.setReceiver(message.getSender());
            aiResponse.setContent(response);
            aiResponse.setType(ChatMessage.MessageType.CHAT);
            aiResponse.setTimestamp(LocalDateTime.now());
            
            // 保存AI响应
            ChatMessage savedResponse = chatMessageRepository.save(aiResponse);
            
            // 通过WebSocket发送响应
            messagingTemplate.convertAndSend("/topic/chat/" + message.getSender(), savedResponse);
        } catch (Exception e) {
            // 如果AI处理失败，发送错误消息
            ChatMessage errorMessage = new ChatMessage();
            errorMessage.setSender("ai");
            errorMessage.setReceiver(message.getSender());
            errorMessage.setContent("抱歉，处理您的消息时出现错误。");
            errorMessage.setType(ChatMessage.MessageType.SYSTEM);
            errorMessage.setTimestamp(LocalDateTime.now());
            
            chatMessageRepository.save(errorMessage);
            messagingTemplate.convertAndSend("/topic/chat/" + message.getSender(), errorMessage);
        }
    }
} 