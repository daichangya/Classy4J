# Classy4J API 文档

## WebSocket API

### 连接WebSocket
- URL: `ws://localhost:8080/ws`
- 协议：STOMP over WebSocket

### 发送消息
- 目标：`/app/chat/send`
- 方法：SEND
- 消息格式：
```json
{
    "content": "消息内容",
    "sender": "发送者ID",
    "receiver": "接收者ID",
    "type": "CHAT"
}
```

### 订阅消息
- 主题：`/topic/chat/{userId}`
- 方法：SUBSCRIBE
- 返回格式：
```json
{
    "id": 1,
    "content": "消息内容",
    "sender": "发送者ID",
    "receiver": "接收者ID",
    "type": "CHAT",
    "timestamp": "2024-03-21T10:00:00"
}
```

## REST API

### 获取聊天历史
- URL: `/api/chat/history`
- 方法：GET
- 参数：
  - sender: 发送者ID
  - receiver: 接收者ID
- 返回格式：
```json
[
    {
        "id": 1,
        "content": "消息内容",
        "sender": "发送者ID",
        "receiver": "接收者ID",
        "type": "CHAT",
        "timestamp": "2024-03-21T10:00:00"
    }
]
```

## AI代理API

### 创建AI代理
- URL: `/api/agent`
- 方法：POST
- 请求体：
```json
{
    "name": "代理名称",
    "description": "代理描述",
    "tools": ["工具1", "工具2"],
    "workflow": "工作流配置"
}
```

### 执行代理任务
- URL: `/api/agent/{agentId}/execute`
- 方法：POST
- 请求体：
```json
{
    "task": "任务描述",
    "parameters": {
        "param1": "值1",
        "param2": "值2"
    }
}
```

## 工具API

### 注册工具
- URL: `/api/tools`
- 方法：POST
- 请求体：
```json
{
    "name": "工具名称",
    "description": "工具描述",
    "parameters": [
        {
            "name": "参数名",
            "type": "参数类型",
            "description": "参数描述"
        }
    ],
    "implementation": "实现类全限定名"
}
```

### 执行工具
- URL: `/api/tools/{toolId}/execute`
- 方法：POST
- 请求体：
```json
{
    "parameters": {
        "param1": "值1",
        "param2": "值2"
    }
}
```

## 工作流API

### 创建工作流
- URL: `/api/workflows`
- 方法：POST
- 请求体：
```json
{
    "name": "工作流名称",
    "description": "工作流描述",
    "steps": [
        {
            "type": "TOOL",
            "toolId": "工具ID",
            "parameters": {
                "param1": "值1"
            }
        },
        {
            "type": "AGENT",
            "agentId": "代理ID",
            "task": "任务描述"
        }
    ]
}
```

### 执行工作流
- URL: `/api/workflows/{workflowId}/execute`
- 方法：POST
- 请求体：
```json
{
    "parameters": {
        "param1": "值1",
        "param2": "值2"
    }
}
```

## 错误码说明

- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器内部错误

## 注意事项

1. 所有请求都需要包含认证头：
```
Authorization: Bearer <token>
```

2. 所有时间戳使用ISO 8601格式

3. 所有请求和响应的编码均为UTF-8

4. API版本信息包含在URL中：`/api/v1/...` 