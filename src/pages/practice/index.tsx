import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QuizPractice from '../../components/quiz-practice';
import { DataSource } from '../../scripts/data-source';
import { Card, Statistic, Progress, Row, Col, Button } from 'antd';
import { User } from '../../entities/user';
import { Quiz, QuizHistory } from '../../entities/quiz';
import ResultModal from '../../components/result-modal';
import { v4 as uuidv4 } from 'uuid';

const PracticePage = () => {
  const { id, difficulty, quizCount } = useParams();
  const quizCountNumber = Number(quizCount);
  const quizBundleId = id;

  const quizBundleRepostiroy = DataSource.getInstance().quizBundleRepository;
  const quizBundle = quizBundleRepostiroy.getById(quizBundleId ?? '');

  const [quiz, setQuiz] = useState<Quiz>(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    return quizRepository.getPracticeQuiz([], quizBundleId ?? '')!;
  });

  const [user, setUser] = useState<User | undefined>(undefined);
  useEffect(() => {
    const userRepository = DataSource.getInstance().userRepository;
    const fetchedUser = userRepository.getById(null);
    setUser(fetchedUser);
  }, []);
  console.log(user);

  const [answeredQuizzes, setAnsweredQuizzes] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  const handleAnswered = (isCorrect: boolean) => {
    setAnswered(answered + 1);
    if (isCorrect) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
    setIsAnswered(true);
  };

  // Determine the difficulty text
  let difficultyText = '';
  if (difficulty === '1') {
    difficultyText = 'DỄ';
  } else if (difficulty === '2') {
    difficultyText = 'THƯỜNG';
  } else if (difficulty === '3') {
    difficultyText = 'KHÓ';
  }

  const handleNextQuiz = () => {
    if (answered === quizCountNumber) {
      const currentHistory = JSON.parse(
        localStorage.getItem(`${quizBundleId}-history`) || '[]'
      );
      const newHistory: QuizHistory = {
        id: uuidv4(),
        answeredCount: Number(quizCount),
        correctAnsweredCount: correct,
        incorrectAnsweredCount: incorrect,
        createdAt: new Date(),
      };
      currentHistory.unshift(newHistory);
      localStorage.setItem(
        `${quizBundleId}-history`,
        JSON.stringify(currentHistory)
      );

      setResultModalVisible(true);
      return;
    }

    setAnsweredQuizzes((prevAnsweredQuizzes) => {
      const newAnsweredQuizzes = [...prevAnsweredQuizzes, quiz.id];
      return newAnsweredQuizzes;
    });
    setIsAnswered(false);
  };

  const handleDelete = () => {
    const nextQuiz = DataSource.getInstance().quizRepository.getPracticeQuiz(
      answeredQuizzes,
      quizBundleId ?? ''
    );
    setQuiz(nextQuiz!);
  };

  useEffect(() => {
    if (answeredQuizzes.length > 0) {
      const nextQuiz = DataSource.getInstance().quizRepository.getPracticeQuiz(
        answeredQuizzes,
        quizBundleId ?? ''
      );
      setQuiz(nextQuiz!);
    }
  }, [answeredQuizzes]);

  return (
    <div>
      <h2 className="text-center">
        Kiểm tra mức độ{' '}
        <span style={{ fontSize: '1.2em' }}>{difficultyText}</span> -{' '}
        {quizBundle!.name}
      </h2>

      <Link to={`/quiz/${quizBundleId}`}>
        <Button type="primary" style={{ marginBottom: 8 }}>
          Quay lại
        </Button>
      </Link>

      {/* Statistics and Progress Bar */}
      <Card title="Tiến trình" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <Card>
              <Statistic
                title="Đã trả lời"
                value={`${answered} / ${quizCountNumber}`}
              />
            </Card>
          </Col>
          {difficulty !== '3' && (
            <>
              <Col>
                <Card>
                  <Statistic title="Trả lời đúng" value={correct} />
                </Card>
              </Col>
              <Col>
                <Card>
                  <Statistic title="Trả lời sai" value={incorrect} />
                </Card>
              </Col>
            </>
          )}

          <Col>
            <p
              style={{
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                fontSize: '24px',
                fontStyle: 'italic',
              }}
            >
              {user?.quote ??
                'Hãy nhập câu châm ngôn của riêng bạn trong phần Profile'}
            </p>
          </Col>
        </Row>

        <Progress
          percent={Number(((answered / quizCountNumber) * 100).toFixed(2))}
          status="active"
          style={{ marginBottom: 16 }}
          strokeColor="#73d13d"
        />
      </Card>

      <Card>
        <QuizPractice
          quizBundleId={quizBundleId ?? ''}
          quizId={quiz!.id}
          difficulty={Number(difficulty) ?? 1}
          onAnswerChecked={handleAnswered}
          onDelete={handleDelete}
        />

        {isAnswered && (
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: 16 }}
          >
            <Button
              color="danger"
              variant="solid"
              size="large"
              className="breathe"
              onClick={handleNextQuiz}
            >
              Tiếp tục
            </Button>
          </div>
        )}
      </Card>

      <ResultModal
        visible={resultModalVisible}
        bundleId={quizBundleId ?? ''}
        correctAnswersCount={correct}
        totalAnswers={quizCountNumber}
        onClose={() => setResultModalVisible(false)}
      />
    </div>
  );
};

export default PracticePage;
