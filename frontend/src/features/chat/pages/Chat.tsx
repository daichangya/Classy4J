import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ChatWindow from '../components/ChatWindow';
import ConversationList from '../components/ConversationList';

const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 84px);
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  gap: 20px;
`;

const Chat: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const currentUser = 'user'; // TODO: 从用户认证状态获取当前用户

  return (
    <ChatContainer>
      <div style={{ width: 300 }}>
        <ConversationList />
      </div>
      {id ? (
        <div style={{ flex: 1 }}>
          <ChatWindow currentUser={currentUser} receiver="ai" conversationId={parseInt(id)} />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0, 0, 0, 0.45)' }}>
          请选择或创建一个会话
        </div>
      )}
    </ChatContainer>
  );
};

export default Chat; 