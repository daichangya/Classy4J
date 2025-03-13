import React from 'react';
import { Layout, Menu } from 'antd';
import { MessageOutlined, ApiOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const { Header } = Layout;

const StyledHeader = styled(Header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  height: 64px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

const Logo = styled.div`
  padding: 0 24px;
  font-size: 20px;
  font-weight: 600;
  color: #1677ff;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #4096ff;
  }
`;

const StyledMenu = styled(Menu)`
  flex: 1;
  border-bottom: none;
  background: transparent;
`;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: '聊天',
    },
    {
      key: '/websocket-test',
      icon: <ApiOutlined />,
      label: 'WebSocket测试',
    },
  ];

  return (
    <StyledHeader>
      <Logo onClick={() => navigate('/')}>Classy4J</Logo>
      <StyledMenu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </StyledHeader>
  );
};

export default Sidebar;