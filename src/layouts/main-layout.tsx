import React, { ReactNode } from 'react';
import { Layout, Menu, Row, Col, Space, Typography, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  GithubOutlined,
  FacebookOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

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
          {/* Add Menu Item for Quiz Bundle */}
          <Menu.Item key="4" icon={<AppstoreAddOutlined />}>
            <Link to="/quiz-bundle">Quiz Bundles</Link>
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
        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: '#001529',
            color: 'white',
          }}
        >
          <Row justify="center" gutter={24}>
            <Col>
              <Space direction="vertical" size="middle">
                <Text className="text-white">
                  Quash ©2024 Created by{' '}
                  <a
                    href="https://github.com/minh711"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    minh711
                  </a>
                </Text>

                <Space size="large">
                  <Text style={{ color: 'white' }}>
                    <PhoneOutlined /> +84 948 256 104
                  </Text>
                  <Text style={{ color: 'white' }}>
                    <MailOutlined /> minhtd.developer@gmail.com
                  </Text>
                </Space>

                <Space size="large">
                  <a
                    href="https://github.com/minh711/quash"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'white' }}
                  >
                    <GithubOutlined /> GitHub
                  </a>
                  <a
                    href="https://www.facebook.com/duyminhtruong711/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'white' }}
                  >
                    <FacebookOutlined /> Facebook
                  </a>
                </Space>

                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfg99HGRGJNbNzlEh51ZaTUTXhkNjiESa0dZtPrLlVMqNezkw/viewform?usp=sf_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button type="primary" shape="round" size="large">
                    Report an Issue
                  </Button>
                </a>
              </Space>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
