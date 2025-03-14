import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Input, Space, Card, List, Tag, message } from 'antd';
import { WebSocketService, ConnectionStatus } from '../features/chat/services/websocket';
import { MessageType } from '../features/chat/types/Message';

const { Content } = Layout;
const { TextArea } = Input;

const WebSocketTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<Array<{ content: string; type: 'sent' | 'received' }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId] = useState(() => {
    const savedUserId = localStorage.getItem('wsTestUserId');
    if (savedUserId) {
      return savedUserId;
    }
    const newUserId = 'test-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('wsTestUserId', newUserId);
    return newUserId;
  });
  const wsRef = useRef<WebSocketService>();

  useEffect(() => {
    // 创建WebSocket服务实例
    wsRef.current = new WebSocketService();

    // 监听连接状态
    wsRef.current.onConnectionStatusChange((status) => {
      setConnectionStatus(status);
      message.info(`WebSocket ${status}`);
    });

    // 监听消息
    wsRef.current.onMessage((msg) => {
      setMessages(prev => [...prev, { content: JSON.stringify(msg), type: 'received' }]);
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  const handleConnect = () => {
    if (wsRef.current) {
      wsRef.current.connect();
      wsRef.current.subscribeToChat(userId);
    }
  };

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current) return;

    const testMessage = {
      content: inputMessage,
      sender: userId,
      receiver: 'ai',
      role: 'user',
      type: MessageType.CHAT,
      timestamp: new Date().toISOString(),
    };

    try {
      wsRef.current.sendMessage(testMessage);
      setMessages(prev => [...prev, { content: JSON.stringify(testMessage), type: 'sent' }]);
      setInputMessage('');
    } catch (error) {
      message.error('发送消息失败');
    }
  };

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'processing';
      case 'disconnected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="连接状态">
            <Space>
              <Tag color={getStatusColor(connectionStatus)}>{connectionStatus}</Tag>
              <Button type="primary" onClick={handleConnect} disabled={connectionStatus === 'connected'}>
                连接
              </Button>
              <Button danger onClick={handleDisconnect} disabled={connectionStatus === 'disconnected'}>
                断开
              </Button>
            </Space>
          </Card>

          <Card title="消息测试">
            <Space direction="vertical" style={{ width: '100%' }}>
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="输入测试消息"
                rows={4}
              />
              <Button type="primary" onClick={handleSendMessage} disabled={connectionStatus !== 'connected'}>
                发送消息
              </Button>
            </Space>
          </Card>

          <Card title="消息记录" style={{ minHeight: '300px' }}>
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item>
                  <Tag color={item.type === 'sent' ? 'blue' : 'green'}>
                    {item.type === 'sent' ? '发送' : '接收'}
                  </Tag>
                  <div style={{ wordBreak: 'break-all' }}>{item.content}</div>
                </List.Item>
              )}
            />
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default WebSocketTest; 