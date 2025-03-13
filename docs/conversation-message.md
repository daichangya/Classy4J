# 会话与消息系统设计文档

## 数据模型

### 会话（Conversation）
```sql
CREATE TABLE conversation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),           -- 会话标题
    last_message TEXT,           -- 最后一条消息内容
    last_message_time DATETIME,  -- 最后一条消息时间
    participants VARCHAR(255),    -- 参与者（逗号分隔的用户ID）
    created_at DATETIME,         -- 创建时间
    updated_at DATETIME          -- 更新时间
);
```

### 消息（ChatMessage）
```sql
CREATE TABLE chat_message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT,               -- 消息内容
    sender VARCHAR(255),        -- 发送者
    receiver VARCHAR(255),      -- 接收者
    type VARCHAR(50),          -- 消息类型（CHAT/SYSTEM/TOOL_CALL/TOOL_RESPONSE）
    role VARCHAR(50),          -- 角色（user/ai/system）
    timestamp DATETIME,        -- 消息时间戳
    conversation_id BIGINT,    -- 关联的会话ID
    FOREIGN KEY (conversation_id) REFERENCES conversation(id)
);
```

## 关系说明

1. 一个会话（Conversation）可以包含多个消息（ChatMessage）
2. 每个消息（ChatMessage）必须属于一个会话（Conversation）
3. 会话通过 `participants` 字段记录参与者
4. 会话的 `last_message` 和 `last_message_time` 字段用于会话列表的预览

## 主要操作流程

### 1. 创建新会话
1. 前端调用 `POST /api/conversations/create`
2. 请求体包含：
   ```json
   {
     "title": "会话标题",
     "participants": "user,ai"
   }
   ```
3. 后端创建会话记录，设置创建时间和更新时间
4. 返回新创建的会话信息

### 2. 发送消息
1. 前端调用 `POST /api/conversations/{id}/messages`
2. 请求体包含：
   ```json
   {
     "content": "消息内容",
     "sender": "user",
     "receiver": "ai",
     "type": "CHAT",
     "role": "user",
     "conversationId": 1
   }
   ```
3. 后端处理流程：
   - 保存消息到数据库
   - 更新会话的最后消息信息
   - 通过 WebSocket 发送消息给接收者
   - 如果接收者是 AI，触发 AI 响应流程

### 3. 加载会话列表
1. 前端调用 `GET /api/conversations/getAll`
2. 后端返回会话预览列表：
   ```json
   [{
     "id": 1,
     "title": "会话标题",
     "lastMessage": "最后一条消息",
     "lastMessageTime": "2024-03-21T10:00:00",
     "participants": "user,ai"
   }]
   ```

### 4. 加载会话消息
1. 前端调用 `GET /api/conversations/{id}/messages`
2. 后端返回该会话的所有消息列表

### 5. WebSocket 消息处理
1. 前端连接 WebSocket：`ws://localhost:8080/ws`
2. 订阅个人消息主题：`/topic/chat/{userId}`
3. 发送消息到：`/app/websocket/send`
4. 消息格式：
   ```json
   {
     "content": "消息内容",
     "sender": "user",
     "receiver": "ai",
     "type": "CHAT",
     "role": "user",
     "conversationId": 1
   }
   ```

## 前端组件关系

1. `ConversationList`：
   - 显示会话列表
   - 创建新会话
   - 切换当前会话

2. `ChatWindow`：
   - 显示当前会话的消息
   - 发送新消息
   - 处理 WebSocket 消息

## 注意事项

1. 消息排序：
   - 会话列表按 `lastMessageTime` 降序排列
   - 消息列表按 `timestamp` 升序排列

2. 实时更新：
   - 使用 WebSocket 实现消息实时推送
   - 新消息到达时自动滚动到底部
   - 支持打字机效果的消息展示

3. 状态管理：
   - 会话列表和当前会话状态独立管理
   - 使用 React 的 `useState` 和 `useEffect` 管理组件状态
   - 使用 `useCallback` 优化性能

4. 错误处理：
   - API 调用失败时显示错误提示
   - WebSocket 断开时自动重连
   - 消息发送失败时保留在输入框

## 后续优化建议

1. 消息分页加载
2. 消息搜索功能
3. 消息撤回功能
4. 已读状态管理
5. 消息类型扩展（图片、文件等）
6. 会话分组功能
7. 消息加密传输
8. 离线消息处理

## API 接口

### 会话管理接口（ConversationController）

1. 创建会话：`POST /api/conversations/create`
2. 获取会话：`GET /api/conversations/{id}`
3. 获取所有会话：`GET /api/conversations/getAll`
4. 更新会话：`PUT /api/conversations/{id}`
5. 删除会话：`DELETE /api/conversations/{id}`
6. 获取会话消息：`GET /api/conversations/{id}/messages`
7. 添加会话消息：`POST /api/conversations/{id}/messages`

### 聊天功能接口（ChatController）

1. 发送消息：`POST /api/chat/send`
   - 用于直接发送消息，不需要指定会话ID
   - 适用于临时对话或系统消息
   ```json
   {
     "content": "消息内容",
     "sender": "user",
     "receiver": "ai",
     "type": "CHAT",
     "role": "user"
   }
   ```

2. 获取消息历史：`GET /api/chat/history`
   - 参数：
     - sender: 发送者ID
     - receiver: 接收者ID
   - 返回指定用户间的所有消息历史
   - 适用于查看特定用户间的完整对话记录

3. WebSocket消息处理：`/app/websocket/send`
   - 通过WebSocket发送实时消息
   - 消息会广播到 `/topic/chat` 主题
   - 用于实时消息推送和接收