import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Avatar,
  Statistic,
  Row,
  Col,
  Descriptions,
  Modal,
  Form,
  Input,
  Button,
} from 'antd';
import { DataSource } from '../../scripts/data-source';
import { User } from '../../entities/user';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the user id from the URL parameter
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false); // State to control avatar modal visibility
  const [form] = Form.useForm(); // Form instance for updating user data

  useEffect(() => {
    const userRepository = DataSource.getInstance().userRepository;
    const fetchedUser = userRepository.getById(id ?? null); // Get the user by ID
    setUser(fetchedUser);
  }, [id]);

  const showModal = () => {
    form.setFieldsValue(user); // Set form fields with current user data
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedUser: User = { ...user!, ...values };
        const userRepository = DataSource.getInstance().userRepository;
        userRepository.update(updatedUser); // Update the user in the repository
        setUser(updatedUser); // Update the state with the new user data
        setIsModalVisible(false); // Close the modal
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const showAvatarModal = () => {
    setIsAvatarModalVisible(true); // Open avatar picker modal
  };

  const handleAvatarSelect = (avatar: string) => {
    if (user) {
      const updatedUser = { ...user, avatar };
      const userRepository = DataSource.getInstance().userRepository;
      userRepository.update(updatedUser); // Update the user in the repository
      setUser(updatedUser); // Update the state with the new avatar
    }
    setIsAvatarModalVisible(false); // Close avatar modal
  };

  const closeAvatarModal = () => {
    setIsAvatarModalVisible(false); // Close avatar modal
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading if user data is not yet fetched
  }

  // Avatar selection options
  const avatars = Array.from(
    { length: 12 },
    (_, index) => `/assets/avatars/avatar-${index}.png`
  );

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={6} xs={24} md={12} lg={6}>
          <Card>
            <div className="d-flex justify-content-center">
              <Avatar
                className="breathe"
                src={user.avatar}
                style={{
                  width: '80%',
                  height: 'auto',
                  aspectRatio: '1/1',
                  marginBottom: 16,
                }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2>{user.name}</h2>
              <p
                style={{
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  fontSize: '24px',
                  fontStyle: 'italic',
                }}
              >
                {user.quote}
              </p>
              <Button
                type="primary"
                style={{ marginBottom: 8, marginRight: 16 }}
                onClick={showModal}
              >
                Thay đổi thông tin
              </Button>
              <Button onClick={showAvatarModal}>Đổi ảnh đại diện</Button>
            </div>
          </Card>
        </Col>
        <Col span={18} xs={24} md={24} lg={18}>
          <Card title="User Stats">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Score" value={user.score} />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Answered Quiz Count"
                  value={user.answeredQuizCount}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Correct Answer Count"
                  value={user.correctAnswerCount}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={8}>
                <Statistic
                  title="Incorrect Answer Count"
                  value={user.incorrectAnswerCount}
                />
              </Col>
              <Col span={8}>
                <Statistic title="Wrath Count" value={user.wrathCount} />
              </Col>
            </Row>
          </Card>

          <Card title="Quiz Stats" style={{ marginTop: '20px' }}>
            <Descriptions>
              <Descriptions.Item label="Uploaded Quiz Count">
                {user.uploadedQuizCount}
              </Descriptions.Item>
              <Descriptions.Item label="Top Correct Per Quiz Count">
                {user.topCorrectPerQuizCount}
              </Descriptions.Item>
              <Descriptions.Item label="Top Incorrect Per Quiz Count">
                {user.topIncorrectPerQuizCount}
              </Descriptions.Item>
              <Descriptions.Item label="Top Wrath Per Quiz Count">
                {user.topWrathPerQuizCount}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Modal for updating user profile */}
      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user.name,
            quote: user.quote,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quote"
            name="quote"
            rules={[{ required: true, message: 'Please input your quote!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for selecting avatar */}
      <Modal
        title="Chọn ảnh đại diện của bạn"
        open={isAvatarModalVisible}
        onCancel={closeAvatarModal}
        footer={null}
        width={800}
      >
        <div className="d-flex justify-content-between">
          <div className="text-muted">Chọn xong nhớ F5 lại trang nhé!</div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfg99HGRGJNbNzlEh51ZaTUTXhkNjiESa0dZtPrLlVMqNezkw/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="primary" shape="round">
              Yêu cầu thêm hình ở đây
            </Button>
          </a>
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 16 }}>
          {avatars.map((avatar, index) => (
            <Col key={index} span={6} style={{ textAlign: 'center' }}>
              <Card hoverable style={{ borderRadius: '50%' }}>
                <Avatar
                  src={avatar}
                  size={128}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default ProfilePage;
