import React from 'react';
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
import { QuizHistory } from '../entities/quiz';
import { Tag } from 'antd';

interface Props {
  data: QuizHistory[];
}

const QuizHistoryChart: React.FC<Props> = ({ data }) => {
  const chartData = [...data]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((entry) => ({
      ...entry,
      mark: ((entry.correctAnsweredCount / entry.answeredCount) * 100).toFixed(
        2
      ),
      date: new Date(entry.createdAt).toLocaleDateString(),
    }));

  const totalCompletions = chartData.length;
  const maxAnsweredCount =
    totalCompletions > 0
      ? Math.max(...chartData.map((d) => d.answeredCount))
      : 0;
  const maxMark =
    totalCompletions > 0 ? Math.max(...chartData.map((d) => +d.mark)) : 0;
  const minMark =
    totalCompletions > 0 ? Math.min(...chartData.map((d) => +d.mark)) : 0;
  const maxIncorrect =
    totalCompletions > 0
      ? Math.max(
          ...chartData.map((d) => d.answeredCount - d.correctAnsweredCount)
        )
      : 0;

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Tag color="blue" style={{ marginBottom: 8 }}>
          Lần hoàn thành: {totalCompletions}
        </Tag>
        <Tag color="green" style={{ marginBottom: 8 }}>
          Câu nhiều nhất: {maxAnsweredCount}
        </Tag>
        <Tag color="purple" style={{ marginBottom: 8 }}>
          Điểm cao nhất: {maxMark.toFixed(2)}%
        </Tag>
        <Tag color="red" style={{ marginBottom: 8 }}>
          Điểm thấp nhất: {minMark.toFixed(2)}%
        </Tag>
        <Tag color="volcano" style={{ marginBottom: 8 }}>
          Sai nhiều nhất: {maxIncorrect}
        </Tag>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />

          {/* Primary Y-axis for percentage values */}
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            label={{
              value: 'Điểm số (%)',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          {/* Secondary Y-axis for answered count */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: 'Số lượng câu hỏi',
              angle: -90,
              position: 'insideRight',
            }}
          />

          <Tooltip
            formatter={(value, name) => [
              name === 'mark' ? `${value}%` : value,
              name,
            ]}
          />
          <Legend />

          {/* Line for Correct Answer Percentage */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="mark"
            stroke="#8884d8"
            name="Điểm số (%)"
            strokeWidth={2}
          />

          {/* Line for Answered Count */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="answeredCount"
            stroke="#82ca9d"
            name="Tổng số câu"
            strokeWidth={2}
          />

          {/* Line for Correct Answer Count */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="correctAnsweredCount"
            stroke="#ffc658"
            name="Trả lời đúng"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuizHistoryChart;
