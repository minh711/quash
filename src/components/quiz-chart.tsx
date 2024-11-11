import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Quiz } from '../entities/quiz';
import QuizProgress from './quiz-progress';

interface QuizChartProps {
  quiz: Quiz;
}

const QuizChart: React.FC<QuizChartProps> = ({ quiz }) => {
  const correctPercentage =
    (quiz.correctAnsweredCount / quiz.answeredCount) * 100;
  const incorrectPercentage =
    (quiz.incorrectAnsweredCount / quiz.answeredCount) * 100;

  const data = [
    {
      name: 'Statistics',
      correctPercentage,
      incorrectPercentage,
    },
  ];

  return (
    <div style={{ width: '100%', marginTop: 8 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Điểm phẫn nộ"
            value={quiz.wrathCount}
            style={{ marginBottom: 16 }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Đã trả lời"
            value={quiz.answeredCount}
            style={{ marginBottom: 16 }}
          />
        </Col>
      </Row>
      <QuizProgress
        correctAnsweredCount={quiz.correctAnsweredCount}
        incorrectAnsweredCount={quiz.incorrectAnsweredCount}
        // correctAnsweredCount={10}
        // incorrectAnsweredCount={5}
      />
    </div>
  );
};

export default QuizChart;
