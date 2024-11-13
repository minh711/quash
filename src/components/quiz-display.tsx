import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Modal, Input, Popconfirm } from 'antd';
import { Quiz, Answer } from '../entities/quiz';
import RichTextEditor from './rich-text-editor';
import { DataSource } from '../scripts/data-source';
import { v4 as uuidv4 } from 'uuid';
import QuizChart from './quiz-chart';
import EditQuizModal from './edit-quiz-modal';

interface QuizDisplayProps {
  quizId: string;
  quizBundleId: string;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quizId, quizBundleId }) => {
  const [showComponent, setShowComponent] = useState(true);

  const [quiz, setQuiz] = useState<Quiz>(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const quiz = quizRepository.getById(quizId, quizBundleId)!;
    return quiz;
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);

  const originQuizTextarea = `${quiz.question
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
    .replace(/<\/?p>/g, '\n')}\n${quiz.answers
    .map((item) => {
      const content = item.content
        .replace(/<strong>/g, '')
        .replace(/<\/strong>/g, '')
        .replace(/<\/?p>/g, '\n');

      return content;
    })
    .join('\n')}`
    .replace(/^\n+|\n+$/g, '')
    .replace(/\n\n(?!\n)/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  const quizTextarea = originQuizTextarea;

  const [inputValue, setInputValue] = useState(quizTextarea);

  const handleAnswerSelect = (id: string) => {
    setQuiz((prevState) => ({
      ...prevState,
      correctAnswers: prevState.correctAnswers.includes(id)
        ? prevState.correctAnswers.filter((item) => item !== id)
        : [...prevState.correctAnswers, id],
    }));
  };

  const showModal = () => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const originQuiz = quizRepository.getById(quizId, quizBundleId)!;
    setQuiz(originQuiz);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const questionContent = document
      .getElementById(`question-editor-${quiz.id}`)
      ?.querySelector('.ql-editor')?.innerHTML;
    const answers: Answer[] = [];
    quiz.answers.forEach((item, index) => {
      const answerContent = document
        .getElementById(`answer-editor-${quiz.id}-${index}`)
        ?.querySelector('.ql-editor')?.innerHTML;
      if (answerContent) {
        const answer: Answer = {
          id: item.id,
          content: answerContent,
        };
        answers.push(answer);
      }
    });

    console.log('Update', questionContent);
    console.log('Update', answers);

    setQuiz({
      ...quiz,
      question: questionContent ?? '',
      answers: answers,
      correctAnswers: quiz.correctAnswers,
    });

    setQuiz(quiz);

    const quizRepository = DataSource.getInstance().quizRepository;
    quizRepository.update({
      ...quiz,
      question: questionContent ?? '',
      answers: answers,
      correctAnswers: quiz.correctAnswers,
    });

    const originQuiz = quizRepository.getById(quizId, quizBundleId)!;
    setQuiz(originQuiz);

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const originQuiz = quizRepository.getById(quizId, quizBundleId)!;
    setQuiz(originQuiz);
    setInputValue(originQuizTextarea);
    setIsModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setConfirmVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const parts = value.trim().split(/\n{2,}/);
    if (parts.length > 0) {
      const question = parts[0]
        .split('\n')
        .map((line) => `<p>${line}</p>`)
        .join('');
      const answers = parts.slice(1).map((answer) => ({
        id: uuidv4(),
        content: answer
          .split('\n')
          .map((line) => `<p>${line}</p>`)
          .join(''),
      }));

      setQuiz({
        ...quiz,
        question,
        answers: answers,
      });
    }
  };

  const handleDeleteConfirm = () => {
    const quizRepository = DataSource.getInstance().quizRepository;
    quizRepository.delete(quiz.id, quiz.quizBundleId!);
    setShowComponent(false);
  };

  const handleDelete = () => {
    setConfirmVisible(true);
  };

  if (!showComponent) return null;

  const handleUpdateQuiz = (updatedQuiz: Quiz) => {
    setQuiz(updatedQuiz);
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div
          className="text-muted d-flex justify-content-between"
          style={{ marginBottom: 8 }}
        >
          <div>
            Được thêm lúc{' '}
            {quiz.createdAt ? new Date(quiz.createdAt).toLocaleString() : ''}
          </div>
          {quiz.createdAt !== quiz.updatedAt && quiz.updatedAt && (
            <div>
              Cập nhật lần cuối vào{' '}
              {quiz.updatedAt ? new Date(quiz.updatedAt).toLocaleString() : ''}
            </div>
          )}
        </div>

        <Row gutter={[16, 16]}>
          <Col span={24} xs={24} md={16}>
            <Card className="quiz-component quiz-display">
              <div
                className="quiz-item-card quiz-question"
                dangerouslySetInnerHTML={{ __html: quiz.question }}
              ></div>

              <div style={{ marginTop: 24 }}>
                {quiz.answers.map((answer: Answer) => (
                  <div
                    className={`quiz-item-card quiz-answer ${quiz.correctAnswers.includes(answer.id) ? 'selected' : ''}`}
                    key={answer.id}
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  ></div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={24} xs={0} md={8}>
            <Card>
              <div className="d-flex">
                <Button
                  type="primary"
                  onClick={showModal}
                  style={{ marginBottom: 8, marginRight: 8 }}
                >
                  Chỉnh sửa
                </Button>
                <div>
                  <Button color="danger" variant="solid" onClick={handleDelete}>
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
                        Bạn có chắc muốn xóa câu hỏi này? Đây là hành động xóa
                        câu hỏi hoàn toàn ra khỏi gói câu hỏi. Việc này không
                        thể hoàn tác và câu hỏi sẽ mất vĩnh viễn.
                      </div>
                    }
                    open={confirmVisible}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span />
                  </Popconfirm>
                </div>
              </div>
              <div>
                <QuizChart quiz={quiz}></QuizChart>
              </div>
            </Card>
          </Col>
        </Row>

        <EditQuizModal
          inputQuiz={quiz}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onUpdate={handleUpdateQuiz}
        />
      </Card>
    </div>
  );
};

export default QuizDisplay;
