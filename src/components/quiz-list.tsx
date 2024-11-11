import React, { useState, useEffect } from 'react';
import { Quiz } from '../entities/quiz';
import QuizDisplay from './quiz-display';
import { DataSource } from '../scripts/data-source';
import { Button, Card } from 'antd';

interface QuizListProps {
  quizzes: Quiz[];
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  const [quizList, setQuizList] = useState<Quiz[]>(quizzes);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
    setQuizList(quizzes);
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
  }, [quizList, quizzes]);

  const deleteQuiz = (quizId: string) => {
    const quizToDelete = quizList.find((quiz) => quiz.id === quizId);
    if (!quizToDelete) return;

    const updatedQuizzes = quizList.filter((quiz) => quiz.id !== quizId);
    setQuizList(updatedQuizzes);

    const quizRepository = DataSource.getInstance().quizRepository;
    const { quizBundleId } = quizToDelete;
    quizRepository.delete(quizId, quizBundleId!);
  };

  const [visibleQuizzes, setVisibleQuizzes] = useState(10);

  const handleLoadMore = () => {
    setVisibleQuizzes(visibleQuizzes + 10);

    const nextPage = currentPage + 1;
    const newQuizzes = DataSource.getInstance().quizRepository.getByBundleId(
      quizList[0].quizBundleId!,
      nextPage,
      pageSize
    );
    setQuizList((prevQuizzes) => [...prevQuizzes, ...newQuizzes]);
    setCurrentPage(nextPage);
  };

  const handleUpdate = (updatedQuiz: Quiz) => {
    setQuizList((prevQuizzes) =>
      prevQuizzes.map((quiz) =>
        quiz.id === updatedQuiz.id ? updatedQuiz : quiz
      )
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <h3>
        Danh sách câu hỏi của bạn
        {quizCount !== 0 ? (
          <span className="text-muted">
            {' '}
            (hiển thị{' '}
            {quizCount < pageSize ? quizCount : currentPage * pageSize}/
            {quizCount})
          </span>
        ) : (
          <>
            <br></br>
            <div
              style={{ fontWeight: 'normal', marginTop: 16 }}
              className="text-muted"
            >
              Chưa có câu hỏi nào
            </div>
          </>
        )}
      </h3>{' '}
      <div>
        {quizList.map((quiz: Quiz) => (
          <QuizDisplay
            key={quiz.id}
            originQuiz={quiz}
            onDelete={deleteQuiz}
            onUpdate={handleUpdate}
          />
        ))}

        {quizCount > visibleQuizzes && (
          <Card>
            <div className="d-flex align-items-center justify-content-center">
              <div>
                <div className="text-muted" style={{ textAlign: 'center' }}>
                  {currentPage * pageSize}/{quizCount}
                </div>
                <Button
                  type="primary"
                  style={{ marginTop: 8 }}
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizList;
