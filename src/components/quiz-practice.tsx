import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Popconfirm, Typography } from 'antd';
import { Quiz, Answer } from '../entities/quiz';
import { DataSource } from '../scripts/data-source';
import EditQuizModal from './edit-quiz-modal';
import { QuizRepository } from '../scripts/quiz-repository';

interface QuizDisplayProps {
  quizId: string;
  quizBundleId: string;
  difficulty: number;
  onAnswerChecked: (isCorrect: boolean) => void;
  onDelete: () => void;
}

const QuizPractice: React.FC<QuizDisplayProps> = ({
  quizId,
  quizBundleId,
  difficulty,
  onAnswerChecked,
  onDelete,
}) => {
  const [quiz, setQuiz] = useState<Quiz>(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const fetchedQuiz = quizRepository.getById(quizId, quizBundleId);
    // Shuffle the answers
    if (fetchedQuiz) {
      const shuffledAnswers = [...fetchedQuiz.answers].sort(
        () => Math.random() - 0.5
      );
      fetchedQuiz.answers = shuffledAnswers;
    }
    return fetchedQuiz!;
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isResult, setIsResult] = useState<boolean>(false);
  const [isHint, setIsHint] = useState<boolean>(false);
  const [isGotHint, setIsGotHint] = useState<boolean>(false);

  useEffect(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const fetchedQuiz = quizRepository.getById(quizId, quizBundleId);
    // Shuffle the answers
    if (fetchedQuiz) {
      const shuffledAnswers = [...fetchedQuiz.answers].sort(
        () => Math.random() - 0.5
      );
      fetchedQuiz.answers = shuffledAnswers;
    }
    setSelectedAnswers([]);
    setIsCorrect(null);
    setIsResult(false);
    setQuiz(fetchedQuiz!);
    setIsChecked(false);
    setIsGotHint(false);
    setIsHint(false);
  }, [quizId, quizBundleId]);

  const handleDeleteConfirm = () => {
    const quizRepository = DataSource.getInstance().quizRepository;
    quizRepository.delete(quiz.id, quiz.quizBundleId!);
    setConfirmVisible(false);
    onDelete();
  };

  const handleUpdateQuiz = (updatedQuiz: Quiz) => {
    setSelectedAnswers([]);
    setIsCorrect(null);
    setIsResult(false);
    setQuiz(updatedQuiz);
    setIsChecked(false);
    setIsGotHint(false);
    setIsHint(false);
  };

  const handleAnswerSelect = (id: string) => {
    if (isChecked) {
      return;
    }
    setSelectedAnswers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((answerId) => answerId !== id)
        : [...prevSelected, id]
    );
  };

  const handleCheck = () => {
    if (selectedAnswers.length === 0) {
      return;
    }
    const isAnswerCorrect =
      selectedAnswers.length > 0 &&
      selectedAnswers.every((id) => quiz.correctAnswers.includes(id)) &&
      quiz.correctAnswers.every((id) => selectedAnswers.includes(id));

    if (difficulty !== 3) {
      setIsResult(true);
      setIsCorrect(isAnswerCorrect);
    }

    let wrathPoint = 0;

    if (isGotHint) {
      wrathPoint += 10;
    }

    if (isAnswerCorrect) {
      wrathPoint -= 5;
    } else {
      wrathPoint += 20;
    }

    const quizRepository = DataSource.getInstance().quizRepository;
    const quizToUpdate = quizRepository.getById(
      quiz.id,
      quiz.quizBundleId ?? ''
    );

    let newWrathCount = (quizToUpdate?.wrathCount || 0) + wrathPoint;
    if (newWrathCount < 0) {
      newWrathCount = 0;
    }

    if (quizToUpdate) {
      quizToUpdate.wrathCount = newWrathCount;
      quizToUpdate.answeredCount = (quizToUpdate.answeredCount || 0) + 1;
      if (isAnswerCorrect) {
        quizToUpdate.correctAnsweredCount =
          (quizToUpdate.correctAnsweredCount || 0) + 1;
      } else {
        quizToUpdate.incorrectAnsweredCount =
          (quizToUpdate.incorrectAnsweredCount || 0) + 1;
      }
    }

    if (quizToUpdate) {
      quizRepository.update(quizToUpdate);
    }

    setIsChecked(true);
    setIsGotHint(false);
    setIsHint(false);
    onAnswerChecked(isAnswerCorrect);
  };

  const handleShowHint = () => {
    setIsGotHint(true);
    setIsHint(!isHint);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24} xs={0} md={4} lg={4}>
          <div
            className="d-flex justify-content-end align-items-center "
            style={{ height: '100%' }}
          >
            {difficulty <= 1 && (
              <div
                className="d-flex justify-content-end align-items-center"
                style={{ height: '100%' }}
              >
                <Button
                  type="primary"
                  onClick={handleShowHint}
                  className="btn-bubble"
                >
                  Gợi ý
                </Button>
              </div>
            )}
          </div>
        </Col>

        <Col span={24} xs={24} md={16} lg={16}>
          <Card
            className={`quiz-component quiz-display quiz-practice ${isResult ? 'result' : ''} ${isHint ? 'hint' : ''}`}
          >
            <div
              className="quiz-item-card quiz-question"
              dangerouslySetInnerHTML={{ __html: quiz.question }}
            ></div>
            <div style={{ marginTop: 24 }}>
              {quiz.answers.map((answer: Answer) => (
                <div
                  key={answer.id}
                  className={`quiz-item-card quiz-answer ${
                    selectedAnswers.includes(answer.id) ? 'selected' : ''
                  } ${quiz.correctAnswers.includes(answer.id) ? 'correct' : ''}`}
                  onClick={() => handleAnswerSelect(answer.id)}
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                  style={{ cursor: 'pointer' }}
                ></div>
              ))}
            </div>
          </Card>
        </Col>

        <Col span={24} xs={0} md={4} lg={4}>
          <div
            className="d-flex justify-content-start align-items-center"
            style={{ height: '100%' }}
          >
            <div>
              {difficulty <= 1 && (
                <Button
                  type="primary"
                  onClick={() => setIsModalVisible(true)}
                  style={{ marginBottom: 8 }}
                  className="btn-bubble"
                >
                  Chỉnh sửa
                </Button>
              )}
              <div className="d-flex justify-content-start">
                <Button
                  color="danger"
                  variant="solid"
                  onClick={() => setConfirmVisible(true)}
                  className="btn-bubble"
                >
                  Xóa
                </Button>
                <Popconfirm
                  title={
                    <div
                      style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        width: '300px',
                      }}
                    >
                      Bạn có chắc muốn xóa câu hỏi này? Đây là hành động xóa câu
                      hỏi hoàn toàn ra khỏi gói câu hỏi. Việc này không thể hoàn
                      tác và câu hỏi sẽ mất vĩnh viễn.
                    </div>
                  }
                  open={confirmVisible}
                  onConfirm={handleDeleteConfirm}
                  onCancel={() => setConfirmVisible(false)}
                  okText="Yes"
                  cancelText="No"
                >
                  <span />
                </Popconfirm>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {isCorrect !== null && (
        <div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ marginTop: 8 }}
          >
            <Typography.Text
              type={isCorrect ? 'success' : 'danger'}
              strong
              style={{ fontSize: '1.4em', padding: 16 }}
            >
              {isCorrect ? 'Đó là một  câu trả lời chính xác!' : 'Sai rồi!'}
            </Typography.Text>
          </div>
        </div>
      )}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: 16 }}
      >
        <Button
          type="primary"
          onClick={handleCheck}
          className={`${isCorrect === null ? 'breathe' : ''}`}
          style={{
            padding: '24px',
            fontWeight: 'bold',
            fontSize: '1.4em',
          }}
          disabled={isChecked}
        >
          Xác nhận
        </Button>
      </div>

      <EditQuizModal
        inputQuiz={quiz}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onUpdate={handleUpdateQuiz}
      />
    </div>
  );
};

export default QuizPractice;
