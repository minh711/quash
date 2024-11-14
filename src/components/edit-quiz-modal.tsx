import React, { useEffect, useState } from 'react';
import { Modal, Card, Col, Row, Input } from 'antd';
import { Quiz, Answer } from '../entities/quiz';
import RichTextEditor from './rich-text-editor';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from '../scripts/data-source';

interface EditQuizModalProps {
  inputQuiz: Quiz;
  visible: boolean;
  onClose: () => void;
  onUpdate: (updatedQuiz: Quiz) => void;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({
  inputQuiz,
  visible,
  onClose,
  onUpdate,
}) => {
  const [quiz, setQuiz] = useState<Quiz>(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const quiz = quizRepository.getById(
      inputQuiz.id,
      inputQuiz.quizBundleId ?? ''
    )!;
    return quiz;
  });

  useEffect(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const updatedQuiz = quizRepository.getById(
      inputQuiz.id,
      inputQuiz.quizBundleId ?? ''
    );

    if (updatedQuiz) {
      setQuiz(updatedQuiz);
    }
  }, [inputQuiz]);

  const [originQuizTextarea, setOriginQuizTextarea] = useState(() => {
    const formattedText = `${quiz.question
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

    return formattedText;
  });

  useEffect(() => {
    const formattedText = `${quiz.question
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

    setOriginQuizTextarea(formattedText);
  }, [quiz]);

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

    const originQuiz = quizRepository.getById(
      inputQuiz.id,
      inputQuiz.quizBundleId ?? ''
    )!;
    setQuiz(originQuiz);
    onUpdate(originQuiz);
    // setIsModalVisible(false);
    onClose();
  };

  const handleCancel = () => {
    const quizRepository = DataSource.getInstance().quizRepository;
    const originQuiz = quizRepository.getById(
      inputQuiz.id,
      inputQuiz.quizBundleId ?? ''
    )!;
    setQuiz(originQuiz);
    setInputValue(originQuizTextarea);
    // setIsModalVisible(false);
    onClose();
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

  return (
    <Modal
      title="Chỉnh sửa câu hỏi"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      closable={false}
      width={1200}
      maskClosable={false}
    >
      <Row gutter={16} align="stretch">
        {/* TextArea input section */}
        <Col
          xs={24}
          sm={24}
          md={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px',
          }}
        >
          <h3>Dán dữ liệu câu hỏi ở đây</h3>
          <Card bordered={false}>
            <div>
              <Input.TextArea
                value={inputValue}
                onChange={handleInputChange}
                rows={24}
                placeholder="Type your question and answers here"
              />
            </div>
          </Card>
        </Col>

        {/* Display section */}
        <Col
          xs={24}
          sm={24}
          md={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          className="quiz-component"
        >
          <h3>Câu hỏi của bạn</h3>
          <Card>
            {!quiz.question ? (
              <div className="text-muted">
                <p>Chưa có câu hỏi. Hãy nhập câu hỏi của bạn.</p>
              </div>
            ) : (
              <div>
                <div className="quiz-item-card quiz-question">
                  <RichTextEditor
                    id={`question-editor-${quiz.id}`}
                    content={quiz.question}
                  />
                </div>
              </div>
            )}

            {/* Show placeholder if there are no answers */}
            {quiz.answers.length === 0 ? (
              <div className="text-muted">
                <p>
                  Chưa có câu trả lời. Tách biệt câu hỏi và các câu trả lời bằng
                  một dòng trống.
                </p>
              </div>
            ) : (
              <div style={{ marginTop: 24 }}>
                {quiz.answers.map((answer, idx) => (
                  <div
                    className={`quiz-item-card quiz-answer ${
                      quiz.correctAnswers.includes(answer.id) ? 'selected' : ''
                    }`}
                    key={idx}
                    style={{
                      marginBottom: 8,
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                    }}
                    onClick={() => handleAnswerSelect(answer.id)}
                  >
                    <RichTextEditor
                      id={`answer-editor-${quiz.id}-${idx}`}
                      content={answer.content}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default EditQuizModal;
