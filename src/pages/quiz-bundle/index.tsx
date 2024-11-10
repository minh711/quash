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
} from 'antd';
import { DataSource } from '../../scripts/data-source';
import { QuizBundle } from '../../entities/quiz';

const QuizBundlePage: React.FC = () => {
  const [quizBundles, setQuizBundles] = useState<QuizBundle[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuizBundle, setCurrentQuizBundle] = useState<QuizBundle | null>(
    null
  );
  const [form] = Form.useForm();

  const dataSource = DataSource.getInstance().quizBundleRepository;

  useEffect(() => {
    // Fetch all quiz bundles when the component mounts
    setQuizBundles(dataSource.getAll());
  }, []);

  const handleAddOrUpdate = (values: any) => {
    const newBundle: QuizBundle = {
      id: currentQuizBundle ? currentQuizBundle.id : Date.now().toString(),
      name: values.name,
      quizzes: [], // Initially, quizzes will be an empty array
    };

    if (currentQuizBundle) {
      // Update existing quiz bundle
      dataSource.update(newBundle);
      setQuizBundles((quizBundles) =>
        quizBundles.map((bundle) =>
          bundle.id === newBundle.id ? newBundle : bundle
        )
      );
      message.success('Quiz Bundle Updated');
    } else {
      // Add new quiz bundle
      dataSource.add(newBundle);
      setQuizBundles((quizBundles) => [newBundle, ...quizBundles]);
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: QuizBundle) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)} type="primary">
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Quiz Bundles"
            extra={
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Add Quiz Bundle
              </Button>
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
