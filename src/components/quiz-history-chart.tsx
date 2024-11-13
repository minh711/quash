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

  return (
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
  );
};

export default QuizHistoryChart;
