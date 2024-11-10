import React, { ReactNode } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
            <Link to="/quiz">Quiz</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{ fontSize: '20px', color: 'white', marginLeft: '16px' }}
          >
            Quash
          </span>
        </Header>
        <Content>
          <div
            style={{
              paddingLeft: 24,
              paddingRight: 24,
              paddingBottom: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Quash ©2024 Created minh711
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
