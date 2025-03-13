# Classy4J AI 项目

这是一个基于Spring Boot和React的AI项目，集成了OpenAI和阿里云AI能力，提供智能对话、工具开发和工作流设计等功能。

## 功能特性

- 智能对话：支持与AI进行实时对话
- AI代理：可以设计和配置AI代理
- 工具开发：支持自定义工具开发和集成
- 工作流设计：可以设计和执行AI工作流
- MCP协议支持：实现了MCP协议的集成

## 技术栈

### 后端
- Java 17
- Spring Boot 3.2.3
- LangChain4j
- WebSocket
- JPA
- H2 Database

### 前端
- React
- TypeScript
- Ant Design
- WebSocket

## 快速开始

### 环境要求
- JDK 17+
- Maven 3.6+
- Node.js 16+

### 配置
在运行项目之前，需要设置以下环境变量：
```bash
export OPENAI_API_KEY=your_openai_api_key
export ALIBABA_API_KEY=your_alibaba_api_key
export ALIBABA_API_SECRET=your_alibaba_api_secret
```

### 运行后端
```bash
mvn spring-boot:run
```

### 运行前端
```bash
cd frontend
npm install
npm start
```

## API文档

### WebSocket端点
- 连接端点：`ws://localhost:8080/ws`
- 订阅主题：`/topic/chat`
- 发送消息：`/app/chat`

### REST API
- 待补充

## 开发计划
1. [ ] 实现基础对话功能
2. [ ] 集成OpenAI API
3. [ ] 集成阿里云AI
4. [ ] 实现AI代理系统
5. [ ] 开发工具集成框架
6. [ ] 设计工作流系统
7. [ ] 实现MCP协议

## 贡献指南
欢迎提交Issue和Pull Request

## 许可证
MIT License 