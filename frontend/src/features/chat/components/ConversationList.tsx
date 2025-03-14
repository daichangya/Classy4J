import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConversationPreview, CreateConversationDto } from '../types/Conversation';
import { conversationApi } from '../services/api';

const Container = styled.div`
  height: 100%;
  background: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
  }
`;

const StyledList = styled(List)`
  flex: 1;
  overflow-y: auto;

  .ant-list-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.02);
    }

    &.active {
      background: #e6f7ff;
    }
  }
` as typeof List;

const ConversationItem = styled.div`
  flex: 1;
  
  .title {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 4px;
  }

  .preview {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .time {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
`;

const ConversationList: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await conversationApi.getAll();
      setConversations(response.data);
    } catch (error) {
      message.error('加载会话列表失败');
    }
  };

  const formatTime = (time?: string | null) => {
    if (!time) return '';
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  };

  const handleCreateConversation = async (values: { title: string }) => {
    try {
      const newConversation: CreateConversationDto = {
        title: values.title,
        participants: 'user,ai',
        messages: []
      };
      await conversationApi.create(newConversation);
      message.success('创建会话成功');
      form.resetFields();
      setModalVisible(false);
      loadConversations();
    } catch (error) {
      message.error('创建会话失败');
    }
  };

  const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await conversationApi.delete(id);
      message.success('删除会话成功');
      loadConversations();
    } catch (error) {
      message.error('删除会话失败');
    }
  };

  return (
    <Container>
      <Header>
        <h3>会话列表</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建会话
        </Button>
      </Header>
      <StyledList
        dataSource={conversations}
        renderItem={(item: ConversationPreview) => (
          <List.Item
            key={item.id}
            onClick={() => navigate(`/chat/${item.id}`)}
            className={location.pathname === `/chat/${item.id}` ? 'active' : ''}
          >
            <ConversationItem>
              <div className="title">
                <MessageOutlined style={{ marginRight: 8 }} />
                {item.title}
              </div>
              {item.lastMessage && (
                <div className="preview">{item.lastMessage}</div>
              )}
            </ConversationItem>
            <div className="time">{formatTime(item.lastMessageTime)}</div>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => handleDeleteConversation(item.id!, e)}
            />
          </List.Item>
        )}
      />
      <Modal
        title="新建会话"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleCreateConversation}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: '请输入会话标题' }]}
          >
            <Input placeholder="请输入会话标题" />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default ConversationList; 