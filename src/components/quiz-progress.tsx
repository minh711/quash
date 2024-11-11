import React from 'react';
import { Card, Tooltip } from 'antd';

interface QuizChartProps {
  correctAnsweredCount: number;
  incorrectAnsweredCount: number;
}

const QuizProgress: React.FC<QuizChartProps> = ({
  correctAnsweredCount,
  incorrectAnsweredCount,
}) => {
  const totalAnsweredCount = correctAnsweredCount + incorrectAnsweredCount;

  // If both counts are zero, set the progress to 100% gray
  const isZeroAnswered = totalAnsweredCount === 0;

  // Calculate the percentages for correct and incorrect answers
  const correctPercentage = isZeroAnswered
    ? 0
    : (correctAnsweredCount / totalAnsweredCount) * 100;
  const incorrectPercentage = isZeroAnswered
    ? 0
    : (incorrectAnsweredCount / totalAnsweredCount) * 100;

  return (
    <div style={{ width: '100%' }}>
      <div className="text-muted" style={{ marginBottom: 8 }}>
        Tỉ lệ trả lời đúng
      </div>
      <div
        style={{
          width: '100%',
          height: '16px',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Show gray bar if both counts are zero */}
        {isZeroAnswered ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#b0b0b0', // Gray color
            }}
          />
        ) : (
          <>
            {/* Tooltip for Correct Answers */}
            <Tooltip
              title={`${correctAnsweredCount} correct - ${correctPercentage.toFixed(2)}%`}
            >
              <div
                style={{
                  width: `${correctPercentage}%`,
                  height: '100%',
                  backgroundColor: '#4caf50', // Green for correct answers
                  float: 'left',
                }}
              />
            </Tooltip>

            {/* Tooltip for Incorrect Answers */}
            <Tooltip
              title={`${incorrectAnsweredCount} incorrect - ${incorrectPercentage.toFixed(2)}%`}
            >
              <div
                style={{
                  width: `${incorrectPercentage}%`,
                  height: '100%',
                  backgroundColor: '#f44336', // Red for incorrect answers
                  float: 'left',
                }}
              />
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizProgress;
