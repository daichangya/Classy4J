package com.classy4j.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.model.openai.OpenAiChatModel;

@Configuration
public class AiConfig {

    @Value("${ai.openai.api-key:11}")
    private String openAiApiKey;

    @Value("${ai.openai.model:22}")
    private String openAiModel;

    @Value("${ai.alibaba.api-key:33}")
    private String alibabaApiKey;

    @Value("${ai.alibaba.api-secret:44}")
    private String alibabaApiSecret;

    @Bean
    public OpenAiChatModel openAiChatModel() {
        return OpenAiChatModel.builder()
                .apiKey(openAiApiKey)
                .modelName(openAiModel)
                .build();
    }

    // TODO: 添加阿里云AI模型配置
} 