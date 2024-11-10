import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Row, Col } from 'antd';
import { Answer, Quiz } from '../../entities/quiz';
import RichTextEditor from '../../components/rich-text-editor';
import { DataSource } from '../../scripts/data-source';
import { v4 as uuidv4 } from 'uuid';
import QuizList from '../../components/quiz-list';
import { message } from 'antd';

const QuizPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [quiz, setQuiz] = useState<Quiz>({
    id: '',
    question: '',
    answers: [],
    correctAnswers: [],
    groups: [],
    tags: [],
    answeredCount: 0,
    correctAnsweredCount: 0,
    incorrectAnsweredCount: 0,
    wrathCount: 0,
  });

  // const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    return quizRepository.getAll();
  });

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

      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        question,
        answers: answers,
      }));
    }
  };

  const handleSubmit = () => {
    const questionContent = document
      .getElementById('question-editor')
      ?.querySelector('.ql-editor')?.innerHTML;

    const answers: Answer[] = [];
    quiz.answers.forEach((_, index) => {
      const answerContent = document
        .getElementById(`answer-editor-${index}`)
        ?.querySelector('.ql-editor')?.innerHTML;

      if (answerContent) {
        const answer: Answer = {
          id: uuidv4(),
          content: answerContent,
        };
        answers.push(answer);
      }
    });

    if (!questionContent || answers.length === 0) {
      message.error('Question or answers cannot be empty!');
      return;
    }

    const newQuiz: Quiz = {
      id: uuidv4(),
      question: questionContent ?? '',
      answers: answers,
      correctAnswers: [],
      answeredCount: 0,
      correctAnsweredCount: 0,
      incorrectAnsweredCount: 0,
      wrathCount: 0,
      groups: [],
      tags: [],
      createdAt: new Date(),
    };

    setQuizzes((prevQuizzes) => {
      const updatedQuizzes = [newQuiz, ...prevQuizzes];
      return updatedQuizzes;
    });

    const quizRepository = DataSource.getInstance().quizRepository;
    quizRepository.add(newQuiz);

    setQuiz({
      id: '',
      question: '',
      answers: [],
      correctAnswers: [],
      groups: [],
      tags: [],
      answeredCount: 0,
      correctAnsweredCount: 0,
      incorrectAnsweredCount: 0,
      wrathCount: 0,
    });
    setInputValue('');

    message.success('Quiz added');
  };

  return (
    <div>
      <h2>Nhập câu hỏi mới</h2>

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
          <div className="mb-sm d-flex">
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
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
          <div className="mb-sm d-flex justify-content-end">
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <Card>
            {!quiz.question ? (
              <div className="text-muted">
                <p>Chưa có câu hỏi. Hãy nhập câu hỏi của bạn.</p>
              </div>
            ) : (
              <div>
                <div className="quiz-item-card quiz-question">
                  <RichTextEditor
                    id="question-editor"
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
                    className="quiz-item-card"
                    key={idx}
                    style={{ marginBottom: 8 }}
                  >
                    <RichTextEditor
                      id={`answer-editor-${idx}`}
                      content={answer.content}
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ marginTop: 16 }}
            >
              Submit
            </Button>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }}>
        <QuizList quizzes={quizzes} />
      </Row>
    </div>
  );
};

export default QuizPage;
