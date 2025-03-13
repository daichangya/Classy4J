import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat';
import Agents from './pages/Agents';
import Tools from './pages/Tools';
import Workflows from './pages/Workflows';
import WebSocketTest from './pages/WebSocketTest';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: #FAFAFA;
`;

const StyledContent = styled(Content)`
  padding: 0;
  margin: 64px auto 0;
  min-height: 280px;
  max-width: 100%;
  width: 100%;
  background: transparent;
  
  @media (max-width: 1600px) {
    padding: 0;
  }
`;

const App: React.FC = () => {
  return (
    <Router>
      <StyledLayout>
        <Sidebar />
        <StyledContent>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/websocket-test" element={<WebSocketTest />} />
          </Routes>
        </StyledContent>
      </StyledLayout>
    </Router>
  );
};

export default App; 