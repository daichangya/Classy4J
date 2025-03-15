package com.classy4j.chat.service.impl;

import com.classy4j.chat.model.ChatMessage;
import com.classy4j.chat.service.ChatService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.time.Duration;

@Service
public class ChatServiceImpl implements ChatService {
    private final Sinks.Many<ChatMessage> chatSink;

    public ChatServiceImpl() {
        this.chatSink = Sinks.many().multicast().onBackpressureBuffer();
    }

    @Override
    public Mono<ChatMessage> sendMessage(ChatMessage message) {
        chatSink.tryEmitNext(message);
        return Mono.just(message);
    }

    @Override
    public Flux<ChatMessage> getMessageHistory(String sender, String receiver) {
        // 实际项目中应该从数据库获取历史消息
        return Flux.empty();
    }

    @Override
    public Flux<ChatMessage> streamMessages(String userId) {
        return chatSink.asFlux();
    }

}