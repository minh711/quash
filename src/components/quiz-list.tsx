import React, { useState, useEffect } from 'react';
import { Quiz } from '../entities/quiz';
import QuizDisplay from './quiz-display';
import { DataSource } from '../scripts/data-source';

interface QuizListProps {
  quizzes: Quiz[];
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  const [quizList, setQuizList] = useState<Quiz[]>(quizzes);

  useEffect(() => {
    setQuizList(quizzes); // Update quizList whenever the quizzes prop changes
  }, [quizzes]);

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = quizList.filter((quiz) => quiz.id !== quizId);
    setQuizList(updatedQuizzes);

    const quizRepository = DataSource.getInstance().quizRepository;
    quizRepository.delete(quizId);
  };

  return (
    <div style={{ width: '100%' }}>
      <h3>Danh sách câu hỏi của bạn ({quizList.length})</h3>
      <div>
        {quizList.map((quiz: Quiz) => (
          <QuizDisplay key={quiz.id} originQuiz={quiz} onDelete={deleteQuiz} />
        ))}
      </div>
    </div>
  );
};

export default QuizList;
