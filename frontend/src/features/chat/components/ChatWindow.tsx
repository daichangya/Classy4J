import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button, message, Avatar, Space, Tag } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';
import { WebSocketService, ConnectionStatus } from '../services/websocket';
import { ChatMessage, MessageType } from '../types/Message';
import { conversationApi } from '../services/api';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f7f9fc;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const InputArea = styled.div`
  display: flex;
  padding: 20px;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);

  .ant-input {
    border-radius: 8px;
    padding: 8px 16px;
    resize: none;
    transition: all 0.3s ease;
    border: 1px solid #e8e8e8;

    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
  }

  .ant-btn {
    border-radius: 8px;
    height: 40px;
    padding: 0 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const MessageBubble = styled.div<{ isSelf: boolean }>`
  max-width: 70%;
  padding: 12px 18px;
  border-radius: ${props => props.isSelf ? '16px 16px 0 16px' : '16px 16px 16px 0'};
  background-color: ${props => props.isSelf ? '#1890ff' : '#f0f2f5'};
  color: ${props => props.isSelf ? 'white' : 'rgba(0, 0, 0, 0.85)'};
  margin: ${props => props.isSelf ? '8px 0 8px auto' : '8px auto 8px 0'};
  box-shadow: 0 2px 8px ${props => props.isSelf ? 'rgba(24, 144, 255, 0.15)' : 'rgba(0, 0, 0, 0.06)'};
  position: relative;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const MessageWrapper = styled.div<{ isSelf: boolean }>`
  display: flex;
  align-items: flex-start;
  margin: 16px 0;
  flex-direction: ${props => props.isSelf ? 'row-reverse' : 'row'};

  .avatar {
    margin: ${props => props.isSelf ? '0 0 0 12px' : '0 12px 0 0'};
  }
`;

const SuggestionsWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MessageTime = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  margin: 16px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 96px;
    height: 1px;
    background: rgba(0, 0, 0, 0.06);
  }

  &::before {
    left: 50%;
    margin-left: 32px;
  }

  &::after {
    right: 50%;
    margin-right: 32px;
  }
`;

interface ChatWindowProps {
  currentUser: string;
  receiver: string;
  conversationId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, receiver, conversationId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [wsService] = useState(() => new WebSocketService());
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions] = useState(['你好，我需要帮助', '请介绍一下你自己', '你能做什么?']);
  const messageListRef = useRef<HTMLDivElement>(null);

  const loadMessageHistory = useCallback(async () => {
    try {
      const response = await conversationApi.getMessages(conversationId);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      message.error('加载历史消息失败');
    }
  }, [conversationId]);

  useEffect(() => {
    const loadAndConnect = async () => {
      await loadMessageHistory();
      wsService.onMessage((chatMessage: ChatMessage) => {
        console.log('收到 WebSocket 消息:', chatMessage);
        if (chatMessage.conversationId === conversationId) {
          console.log('消息属于当前会话，准备更新界面');
          setMessages(prev => {
            console.log('当前消息列表:', prev);
            return [...prev, chatMessage];
          });
          scrollToBottom();
          setIsTyping(false);
        } else {
          console.log('消息不属于当前会话，忽略');
        }
      });
      wsService.onConnectionStatusChange((status: ConnectionStatus) => {
        console.log('WebSocket 连接状态变更:', status);
        if (status === 'connected') {
          console.log('WebSocket 已连接');
        } else if (status === 'disconnected') {
          console.log('聊天连接断开，正在重试...');
        }
      });
      wsService.subscribeToChat(currentUser);
    };
    loadAndConnect();
    return () => {
      wsService.disconnect();
    };
  }, [currentUser, conversationId, loadMessageHistory]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      console.log('滚动到底部');
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) {
      return;
    }

    const newMessage: ChatMessage = {
      content: inputValue.trim(),
      sender: currentUser,
      receiver: receiver,
      type: MessageType.CHAT,
      role: 'user',
      timestamp: new Date().toISOString(),
      conversationId: conversationId
    };

    try {
      console.log('准备发送消息:', newMessage);
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      scrollToBottom();
      await conversationApi.addMessage(conversationId, newMessage);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败');
    }
  };

  return (
    <ChatContainer>
      <MessageList ref={messageListRef}>
        {messages.map((msg, index) => {
          const isSelf = msg.sender === currentUser;
          const showTime = index === 0 || 
            (msg.timestamp && messages[index - 1]?.timestamp && 
            new Date(msg.timestamp || '').getTime() - new Date(messages[index - 1].timestamp || '').getTime() > 5 * 60 * 1000);

          return (
            <React.Fragment key={index}>
              {showTime && (
                <MessageTime>{new Date(msg.timestamp || '').toLocaleString()}</MessageTime>
              )}
              <MessageWrapper isSelf={isSelf}>
                <Avatar
                  className="avatar"
                  icon={isSelf ? <UserOutlined /> : <RobotOutlined />}
                  style={{
                    backgroundColor: isSelf ? '#1890ff' : '#f56a00',
                  }}
                />
                <MessageBubble isSelf={isSelf}>
                  {isSelf ? (
                    msg.content
                  ) : (
                    <Typewriter
                      onInit={(typewriter) => {
                        typewriter
                          .typeString(msg.content)
                          .start();
                      }}
                      options={{
                        delay: 30,
                        cursor: isTyping ? '|' : '',
                        autoStart: false
                      }}
                    />
                  )}
                </MessageBubble>
              </MessageWrapper>
            </React.Fragment>
          );
        })}
      </MessageList>
      <InputArea>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onPressEnter={handleSend}
            placeholder="输入消息..."
            style={{ marginRight: 8 }}
          />
          <SuggestionsWrapper>
            {suggestions.map((suggestion, index) => (
              <Tag
                key={index}
                color="blue"
                style={{ cursor: 'pointer' }}
                onClick={() => setInputValue(suggestion)}
              >
                {suggestion}
              </Tag>
            ))}
          </SuggestionsWrapper>
        </Space>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
        >
          发送
        </Button>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatWindow; 