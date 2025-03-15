import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button, message, Avatar, Space, Tag } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';
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
  
  .typing-cursor {
    display: inline-block;
    width: 2px;
    height: 16px;
    background-color: currentColor;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
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
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
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
    loadMessageHistory();
  }, [loadMessageHistory]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const handleStreamResponse = async (response: Response, retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    const retryDelay = 1000;

    try {
      if (!response.ok) {
        throw new Error(`Stream request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream reading completed');
          break;
        }

        const text = new TextDecoder().decode(value);
        console.log('Received raw text:', text);
        const lines = text.split('\n').filter(line => line.trim() !== '');
        console.log('Filtered lines:', lines);

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            console.log('Parsed data:', data);
            if (data === '[DONE]') {
              console.log('Received [DONE] signal');
              if (streamingMessage) {
                console.log('Adding final message:', streamingMessage);
                setMessages(prev => [...prev, streamingMessage]);
                // 确保消息被添加到列表后再清除状态
                setTimeout(() => {
                  setIsTyping(false);
                  setStreamingMessage(null);
                }, 0);
              } else {
                setIsTyping(false);
              }
              break;
            }
            try {
              const content = JSON.parse(data);
              console.log('Parsed content:', content);
              setStreamingMessage((prev: ChatMessage | null) => {
                const newMessage = {
                  ...prev!,
                  content: prev ? prev.content + content.content : content.content
                };
                console.log('Updated streaming message:', newMessage);
                return newMessage;
              });
            } catch (e) {
              console.error('Failed to parse streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        console.warn(`Retrying stream connection (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        const newResponse = await conversationApi.streamChat(conversationId, {
          ...streamingMessage!,
          content: streamingMessage?.content || ''
        });
        return handleStreamResponse(newResponse, retryCount + 1);
      }
      message.error('聊天连接失败，请稍后重试');
      setIsTyping(false);
      setStreamingMessage(null);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      content: inputValue.trim(),
      sender: currentUser,
      receiver: receiver,
      type: MessageType.CHAT,
      role: 'user',
      timestamp: new Date().toISOString(),
      conversationId: conversationId
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    scrollToBottom();

    try {
      setIsTyping(true);
      const response = await conversationApi.streamChat(conversationId, newMessage);
      await handleStreamResponse(response);
    } catch (error) {
      message.error('发送消息失败');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <ChatContainer>
      <MessageList ref={messageListRef}>
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            <MessageWrapper isSelf={msg.sender === currentUser}>
              <Avatar
                className="avatar"
                icon={msg.sender === currentUser ? <UserOutlined /> : <RobotOutlined />}
              />
              <MessageBubble isSelf={msg.sender === currentUser}>
                {msg.content}
              </MessageBubble>
            </MessageWrapper>
          </React.Fragment>
        ))}
        {streamingMessage && (
          <MessageWrapper isSelf={false}>
            <Avatar className="avatar" icon={<RobotOutlined />} />
            <MessageBubble isSelf={false}>
              <Typewriter
                options={{
                  strings: [streamingMessage.content],
                  autoStart: true,
                  delay: 30,
                  cursor: ''
                }}
              />
            </MessageBubble>
          </MessageWrapper>
        )}
      </MessageList>
      <InputArea>
        <Space.Compact style={{ width: '100%' }}>
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isTyping}
          >
            发送
          </Button>
        </Space.Compact>
        <SuggestionsWrapper>
          {suggestions.map((suggestion, index) => (
            <Tag
              key={index}
              color="blue"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Tag>
          ))}
        </SuggestionsWrapper>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatWindow;