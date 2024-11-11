import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Modal,
  Input,
  Form,
  message,
  Tag,
} from 'antd';
import { DataSource } from '../../scripts/data-source';
import { Quiz, QuizBundle } from '../../entities/quiz';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const QuizBundlePage: React.FC = () => {
  const [quizBundles, setQuizBundles] = useState<QuizBundle[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuizBundle, setCurrentQuizBundle] = useState<QuizBundle | null>(
    null
  );
  const [form] = Form.useForm();

  const dataSource = DataSource.getInstance().quizBundleRepository;
  const quizRepository = DataSource.getInstance().quizRepository;

  useEffect(() => {
    setQuizBundles(dataSource.getAll());
  }, []);

  const handleAddOrUpdate = (values: any) => {
    const newBundle: QuizBundle = {
      id: currentQuizBundle ? currentQuizBundle.id : uuidv4(),
      name: values.name,
      isPreset: false,
    };

    if (currentQuizBundle) {
      setQuizBundles((quizBundles) =>
        quizBundles.map((bundle) =>
          bundle.id === newBundle.id ? newBundle : bundle
        )
      );
      dataSource.update(newBundle);
      message.success('Quiz Bundle Updated');
    } else {
      setQuizBundles((quizBundles) => [newBundle, ...quizBundles]);
      dataSource.add(newBundle);
      message.success('Quiz Bundle Added');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (quizBundle: QuizBundle) => {
    setCurrentQuizBundle(quizBundle);
    form.setFieldsValue({
      name: quizBundle.name,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    dataSource.delete(id);
    setQuizBundles(quizBundles.filter((bundle) => bundle.id !== id));
    message.success('Quiz Bundle Deleted');
  };

  const columns = [
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text: string, item: QuizBundle) => {
        const colors: string[] = [
          'magenta',
          'red',
          'volcano',
          'orange',
          'gold',
          'lime',
          'green',
          'cyan',
          'blue',
          'geekblue',
          'purple',
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const isPreset = item.isPreset;

        return (
          <Link to={`/quiz/${item.id}`}>
            <Tag
              color={randomColor}
              style={{ fontSize: '16px', padding: '12px 12px', width: '100%' }}
              className={isPreset ? 'preset-bundle' : ''}
            >
              {text}
            </Tag>
          </Link>
        );
      },
    },
    {
      title: 'Mô tả',
      width: 300,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: any, record: QuizBundle) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)} type="primary">
            Edit
          </Button>
          <Button
            color="danger"
            variant="solid"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Các gói câu hỏi của bạn</h2>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            extra={
              <Space>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  Add Quiz Bundle
                </Button>
              </Space>
            }
          >
            <Table dataSource={quizBundles} columns={columns} rowKey="id" />
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Quiz Bundle Modal */}
      <Modal
        title={currentQuizBundle ? 'Edit Quiz Bundle' : 'Add Quiz Bundle'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdate}
          initialValues={{ name: currentQuizBundle?.name }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please input the name of the quiz bundle!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentQuizBundle ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuizBundlePage;
