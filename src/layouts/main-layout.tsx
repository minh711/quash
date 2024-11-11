import React, { ReactNode, useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Row,
  Col,
  Space,
  Typography,
  Button,
  Avatar,
} from 'antd';
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
import { DataSource } from '../scripts/data-source';
import { User } from '../entities/user';

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

  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const userRepository = DataSource.getInstance().userRepository;
    const fetchedUser = userRepository.getById(null);
    setUser(fetchedUser);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Trang chủ
          </Menu.Item>
          <Menu.Item key="4" icon={<AppstoreAddOutlined />}>
            <Link to="/quiz-bundle">Gói câu hỏi</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
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
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '16px',
              }}
            >
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '16px',
                  color: 'white',
                }}
              >
                <Text style={{ color: 'white', marginRight: 8 }}>
                  {user.name}
                </Text>
                <Avatar
                  src={user.avatar}
                  size={40}
                  style={{ marginRight: '8px' }}
                />
              </Link>
            </div>
          )}
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
