import React, { useState } from 'react';
import { Card, Button, Input, Row, Col, Divider } from 'antd';

const QuizPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Split by exactly two newlines (\n\n) to preserve the division between question and answers
    const parts = value.trim().split(/\n{2,}/);

    // Set the first part as the question and the rest as answers
    if (parts.length > 0) {
      setQuestion(parts[0]);
      setAnswers(parts.slice(1));
    }
  };

  const handleSubmit = () => {
    alert(`Question: ${question}\nAnswers: ${answers.join(', ')}`);
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
          style={{ display: 'flex', flexDirection: 'column', height: '700px' }}
        >
          <h3>Dán dữ liệu câu hỏi ở đây</h3>
          <div className="mb-sm">
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <Card
            bordered={false}
            style={{
              flex: 1,
              height: '100%',
            }}
          >
            <div>
              <Input.TextArea
                value={inputValue}
                onChange={handleInputChange}
                rows={24}
                maxLength={500}
                placeholder="Type your question and answers here"
                style={{
                  resize: 'none',
                  overflowY: 'auto',
                }}
              />
            </div>
          </Card>
        </Col>

        {/* Display section */}
        <Col
          xs={24}
          sm={24}
          md={12}
          style={{ display: 'flex', flexDirection: 'column', height: '700px' }}
        >
          <h3>Câu hỏi của bạn</h3>
          <div className="mb-sm">
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <Card
            style={{
              flex: 1,
              height: '100%',
              maxHeight: '700px',
              overflowY: 'auto',
            }}
          >
            {!question ? (
              <div style={{ padding: 16, color: '#888' }}>
                <p>Chưa có câu hỏi. Hãy nhập câu hỏi vào ô bên trên.</p>
              </div>
            ) : (
              <div>
                <div className="quiz-item-card quiz-question">
                  <p>
                    {question.split('\n').map((line, idx) => (
                      <p key={idx}>
                        {line}
                        <br />
                      </p>
                    ))}
                  </p>
                </div>
              </div>
            )}

            {/* Show placeholder if there are no answers */}
            {answers.length === 0 ? (
              <div style={{ padding: 16, color: '#888' }}>
                <p>Chưa có câu trả lời. Hãy nhập câu trả lời vào ô bên trên.</p>
              </div>
            ) : (
              <div style={{ marginTop: 24 }}>
                {answers.map((answer, idx) => (
                  <div
                    className="quiz-item-card"
                    key={idx}
                    style={{ marginBottom: 8 }}
                  >
                    {answer.split('\n').map((line, idx) => (
                      <p key={idx}>
                        {line}
                        <br />
                      </p>
                    ))}
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
