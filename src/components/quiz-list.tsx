import React, { useState, useEffect } from 'react';
import { Quiz } from '../entities/quiz';
import QuizDisplay from './quiz-display';
import { DataSource } from '../scripts/data-source';

interface QuizListProps {
  quizzes: Quiz[] | null;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  const [quizList, setQuizList] = useState<Quiz[] | null>(quizzes);
  const [quizCount, setQuizCount] = useState<number>(0);

  useEffect(() => {
    if (quizzes) {
      setQuizList(quizzes);
      setQuizList(null);
    }
  }, [quizzes]);

  useEffect(() => {
    if (quizList && quizList.length > 0) {
      const count = Number(
        localStorage.getItem(`${quizList[0].quizBundleId}-count`) || '0'
      );
      setQuizCount(count);
    } else {
      setQuizCount(0);
    }
  }, [quizList]);

  const deleteQuiz = (quizId: string) => {
    if (!quizList) return;

    const quizToDelete = quizList.find((quiz) => quiz.id === quizId);
    if (!quizToDelete) return;

    const updatedQuizzes = quizList.filter((quiz) => quiz.id !== quizId);
    setQuizList(updatedQuizzes);

    const quizRepository = DataSource.getInstance().quizRepository;
    const { quizBundleId } = quizToDelete;
    quizRepository.delete(quizId, quizBundleId!);
  };

  return (
    <div style={{ width: '100%' }}>
      <h3>Danh sách câu hỏi của bạn ({quizCount})</h3>{' '}
      <div>
        {quizList && quizList.length > 0 ? (
          quizList.map((quiz: Quiz) => (
            <QuizDisplay
              key={quiz.id}
              originQuiz={quiz}
              onDelete={deleteQuiz}
            />
          ))
        ) : (
          <p>No quizzes available</p>
        )}
      </div>
    </div>
  );
};

export default QuizList;
