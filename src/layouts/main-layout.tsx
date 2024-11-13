import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Layout,
  Menu,
  Row,
  Col,
  Space,
  Typography,
  Button,
  Avatar,
  Collapse,
  Upload,
  Modal,
  message,
  Tooltip,
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
  MenuOutlined,
  UploadOutlined,
  DownloadOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { DataSource } from '../scripts/data-source';
import { User } from '../entities/user';
import { QuizBundle } from '../entities/quiz';
import JSZip from 'jszip';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [buttonCollapsed, setButtonCollapsed] = useState(true);

  const toggleButtonsCollapse = () => {
    setButtonCollapsed(!buttonCollapsed);
  };

  const [quizBundles, setQuizBundles] = useState<QuizBundle[]>([]);

  useEffect(() => {
    const repository = DataSource.getInstance().quizBundleRepository;
    setQuizBundles(repository.getAll());
  }, []);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const userRepository = DataSource.getInstance().userRepository;
    const fetchedUser = userRepository.getById(null);
    setUser(fetchedUser);
  }, []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      try {
        // Parse the JSON file content
        const reader = new FileReader();
        reader.onload = () => {
          const jsonData = JSON.parse(reader.result as string);

          // Iterate over each key in the parsed data and save it to localStorage
          Object.keys(jsonData).forEach((key) => {
            localStorage.setItem(key, JSON.stringify(jsonData[key])); // Overwrite existing key if any
          });
          message.success('Data imported successfully');
        };
        reader.readAsText(file); // Read the file as text
      } catch (error) {
        message.error('Failed to parse the JSON file');
      }
    } else {
      message.error('No file selected');
    }
  };

  const exportData = () => {
    const confirmExport = window.confirm(
      'Bạn có chắc muốn tải file dữ liệu về máy không?'
    );

    if (!confirmExport) {
      return; // Exit the function if the user cancels the confirmation
    }

    // Initialize a new JSZip instance
    const zip = new JSZip();

    // Retrieve all items from localStorage and add each as a file in the zip
    Object.keys(localStorage).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        zip.file(`${key}.json`, item); // Add each item to the zip file with key as filename
      }
    });

    // Generate the ZIP file
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'localStorageData.zip'; // Specify the filename for the ZIP
      link.click(); // Trigger the download
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['3']}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
            <Link to="/quiz-bundle">Các gói câu hỏi</Link>
          </Menu.Item>
          {/* <Menu.SubMenu
            key="3"
            icon={<AppstoreAddOutlined />}
            title="Chọn nhanh"
            style={{ maxHeight: '600px', overflowY: 'auto' }}
            className="scrollable-submenu"
          >
            {quizBundles.map((bundle) => (
              <Menu.Item key={bundle.id}>
                <Tooltip
                  title="Nhấn đề truy cập nhanh vào một gói câu hỏi"
                  placement="right"
                >
                  <Link to={`/quiz/${bundle.id}`}>{bundle.name}</Link>
                </Tooltip>
              </Menu.Item>
            ))}
          </Menu.SubMenu> */}

          <Menu.SubMenu
            key="4"
            icon={<ToolOutlined />}
            title="Cài đặt"
            style={{ maxHeight: '600px', overflowY: 'auto' }}
            className="scrollable-submenu"
          >
            <Menu.Item key="4-1" icon={<UploadOutlined />}>
              <div>
                <div
                  onClick={() => {
                    const confirmUpload = window.confirm(
                      'Bạn có chắc muốn tải file lên không?\n\nDữ liệu có thể bị ghi đè, hãy chắc chắc rằng bạn đã tải một bản dự phòng trước đó'
                    );

                    if (confirmUpload) {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  Tải file lên
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>
            </Menu.Item>
            <Menu.Item key="4-2" icon={<DownloadOutlined />}>
              <div onClick={exportData}>Lưu về máy</div>
            </Menu.Item>
          </Menu.SubMenu>
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
            style={{
              fontSize: '20px',
              color: 'white',
              marginLeft: '16px',
              userSelect: 'none',
            }}
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
