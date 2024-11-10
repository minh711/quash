import React, { useState } from 'react';
import { Card, Button, Input, Row, Col, Divider } from 'antd';
import { Quiz } from '../../entities/quiz';
import RichTextEditor from '../../components/rich-text-editor';

const QuizPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  // const [question, setQuestion] = useState('');
  // const [answers, setAnswers] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<Quiz>({
    id: 1,
    question: '',
    answers: [],
    correctAnswers: [],
    answeredCount: 0,
    correctAnsweredCount: 0,
    incorrectAnsweredCount: 0,
    wrathCount: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Split by exactly two newlines (\n\n) to preserve the division between question and answers
    const parts = value.trim().split(/\n{2,}/);
    console.log(parts.length);
    if (parts.length > 0) {
      const question = parts[0]
        .split('\n')
        .map((line) => `<p>${line}</p>`)
        .join('');
      const answers = parts.slice(1).map((answer, idx) => ({
        id: idx + 1,
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
    alert(`Question: ${quiz.question}\nAnswers: ${quiz.answers.join(', ')}`);
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
              <div style={{ color: '#888' }}>
                <p>Chưa có câu hỏi. Hãy nhập câu hỏi của bạn.</p>
              </div>
            ) : (
              <div>
                <div className="quiz-item-card quiz-question">
                  <RichTextEditor content={quiz.question} />
                </div>
              </div>
            )}

            {/* Show placeholder if there are no answers */}
            {quiz.answers.length === 0 ? (
              <div style={{ color: '#888' }}>
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
                    <RichTextEditor content={answer.content} />
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
    </div>
  );
};

export default QuizPage;
