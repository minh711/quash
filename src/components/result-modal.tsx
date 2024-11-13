import React from 'react';
import { Modal, Button, Typography } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  Label,
  LabelList,
} from 'recharts';
import { Link } from 'react-router-dom';

interface ResultModalProps {
  visible: boolean;
  correctAnswersCount: number;
  totalAnswers: number;
  bundleId: string;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  correctAnswersCount,
  totalAnswers,
  bundleId,
  onClose,
}) => {
  const incorrectAnswersCount = totalAnswers - correctAnswersCount;

  const data = [
    { name: 'Đúng', value: correctAnswersCount },
    { name: 'Sai', value: incorrectAnswersCount },
  ];

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onClose}
      width={400}
      maskClosable={false}
      closable={false}
      title="Kết quả bài thi"
    >
      <div style={{ textAlign: 'center' }}>
        <Typography.Text strong style={{ fontSize: '1.6em' }}>
          Chúc mừng bạn đã<br></br> hoàn thành bài thi!
        </Typography.Text>
        <p style={{ fontSize: '1.4em' }}>Tổng số câu: {totalAnswers}</p>
        <div className="d-flex justify-content-center align-items-center">
          <PieChart width={300} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill="#73d13d" />
              <Cell fill="#ff4d4f" />
              <Label
                value={`${((correctAnswersCount / totalAnswers) * 100).toFixed(2)}%`}
                position="center"
                style={{ fontSize: '2.4em', fontWeight: 'bold', fill: '#333' }}
              />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <Link to={`/quiz/${bundleId}`}>
          <Button type="primary" size="large" style={{ marginTop: 24 }}>
            Trở về
          </Button>
        </Link>
      </div>
    </Modal>
  );
};

export default ResultModal;
