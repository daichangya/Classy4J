package com.classy4j.chat.service;

import com.classy4j.chat.model.ChatMessage;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatService {
    Mono<ChatMessage> sendMessage(ChatMessage message);
    Flux<ChatMessage> getMessageHistory(String sender, String receiver);
    Flux<ChatMessage> streamMessages(String userId);
}