import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import { QuizBundle } from '../../entities/quiz';
import { DataSource } from '../../scripts/data-source';
import { Link } from 'react-router-dom';

const QuizBundlePage: React.FC = () => {
  const [quizBundles, setQuizBundles] = useState<QuizBundle[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBundle, setEditingBundle] = useState<QuizBundle | null>(null);
  const [form] = Form.useForm();

  const quizBundleRepository = DataSource.getInstance().quizBundleRepository;

  useEffect(() => {
    setQuizBundles(quizBundleRepository.getAll());
  }, []);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newBundle = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        isPreset: false,
      };
      quizBundleRepository.add(newBundle);
      setQuizBundles(quizBundleRepository.getAll());
      form.resetFields();
      setIsModalVisible(false);
      message.success('Quiz bundle added');
    });
  };

  const handleUpdate = () => {
    if (editingBundle) {
      form.validateFields().then((values) => {
        const updatedBundle = { ...editingBundle, ...values };
        quizBundleRepository.update(updatedBundle);
        setQuizBundles(quizBundleRepository.getAll());
        setEditingBundle(null);
        setIsModalVisible(false);
        message.success('Quiz bundle updated');
      });
    }
  };

  const handleDelete = (id: string) => {
    quizBundleRepository.delete(id);
    setQuizBundles(quizBundleRepository.getAll());
    message.success('Quiz bundle deleted');
  };

  const openModal = (bundle?: QuizBundle) => {
    setIsModalVisible(true);
    if (bundle) {
      setEditingBundle(bundle);
      form.setFieldsValue(bundle);
    } else {
      setEditingBundle(null);
      form.resetFields();
    }
  };

  const columns = [
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date: Date) => date?.toLocaleString(),
    },
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (text: string, item: QuizBundle) => {
        const quizCount = localStorage.getItem(`${item.id}-count`) || '0';

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
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {text}
              </span>{' '}
              ({quizCount} câu)
            </Tag>
          </Link>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: any, bundle: QuizBundle) => (
        <>
          <Button type="link" onClick={() => openModal(bundle)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this quiz bundle?"
            onConfirm={() => handleDelete(bundle.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <h2>Các gói câu hỏi của bạn</h2>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 16 }}
      >
        Add Quiz Bundle
      </Button>
      <Table
        dataSource={quizBundles}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={editingBundle ? handleUpdate : handleAdd}
        title={editingBundle ? 'Edit Quiz Bundle' : 'Add Quiz Bundle'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QuizBundlePage;
