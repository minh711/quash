import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Row, Col, Collapse, Modal, Form } from 'antd';
import { Answer, Quiz, QuizBundle } from '../../entities/quiz';
import RichTextEditor from '../../components/rich-text-editor';
import { DataSource } from '../../scripts/data-source';
import { v4 as uuidv4 } from 'uuid';
import QuizList from '../../components/quiz-list';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const QuizPage: React.FC = () => {
  const { id } = useParams();
  const quizBundleId = id;

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
    quizBundleId: quizBundleId,
  });

  const [quizBundle, setQuizBundle] = useState<QuizBundle>(() => {
    const quizBundleRepository = DataSource.getInstance().quizBundleRepository;
    return quizBundleRepository.getById(quizBundleId!)!;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const quizRepository = DataSource.getInstance().quizRepository;
    return quizRepository.getByBundleId(quizBundleId!);
  });

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleAnswerSelect = (id: string) => {
    setSelectedAnswers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
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
    quiz.answers.forEach((item, index) => {
      const answerContent = document.querySelector(
        `#answer-editor-${index} .ql-editor`
      )?.innerHTML;
      if (answerContent) {
        const answer: Answer = {
          id: item.id,
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
      correctAnswers: selectedAnswers,
      answeredCount: 0,
      correctAnsweredCount: 0,
      incorrectAnsweredCount: 0,
      wrathCount: 0,
      groups: [],
      tags: [],
      createdAt: new Date(),
      quizBundleId: quizBundleId,
    };

    setQuizzes((prevQuizzes) => {
      const updatedQuizzes = [newQuiz, ...prevQuizzes];
      return updatedQuizzes;
    });

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
      quizBundleId: quizBundleId,
    });
    setInputValue('');

    const quizRepository = DataSource.getInstance().quizRepository;
    quizRepository.add(newQuiz);
    message.success('Quiz added');
  };

  const [csvText, setCsvText] = useState('');
  const [isCsvModalVisible, setIsCsvModalVisible] = useState(false);

  const handleCsvChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(e.target.value);
  };

  const handleImportCsv = () => {
    if (!csvText) {
      message.error('Please paste some CSV data');
      return;
    }

    try {
      const quizRepository = DataSource.getInstance().quizRepository;
      quizRepository.importCsvData(csvText, quizBundle.id);
      message.success('CSV data successfully imported');
      setIsCsvModalVisible(false);
      setCsvText('');

      setQuizzes((prevQuizzes) => {
        const quizzes = quizRepository.getByBundleId(quizBundle.id);
        return quizzes;
      });
    } catch (error) {
      message.error('Error importing CSV data');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>{quizBundle.name}</h2>
        <Button
          color="danger"
          size="large"
          variant="solid"
          className="breathe"
          onClick={() => setIsCsvModalVisible(true)}
        >
          Import CSV
        </Button>
      </div>
      <p className="text-muted">{quizBundle.description}</p>

      <Collapse
        defaultActiveKey={[]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="Nhập câu hỏi mới" key="1">
          <h2 style={{ marginTop: 0 }}>Nhập câu hỏi mới</h2>
          <Row gutter={[16, 16]} align="stretch">
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
              <Card>
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
                      Chưa có câu trả lời. Tách biệt câu hỏi và các câu trả lời
                      bằng một dòng trống.
                    </p>
                  </div>
                ) : (
                  <div style={{ marginTop: 24 }}>
                    {quiz.answers.map((answer, idx) => (
                      <div
                        className={`quiz-item-card quiz-answer-edit quiz-answer ${selectedAnswers.includes(answer.id) ? 'selected' : ''}`}
                        key={idx}
                        style={{
                          marginBottom: 8,
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                        onClick={() => handleAnswerSelect(answer.id)}
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
        </Panel>
      </Collapse>

      <Row style={{ marginTop: 16 }}>
        <QuizList quizzes={quizzes} />
      </Row>

      {/* Import CSV Modal */}
      <Modal
        title="Import CSV Data"
        open={isCsvModalVisible}
        onCancel={() => setIsCsvModalVisible(false)}
        footer={null}
      >
        <Form>
          <Form.Item label="Paste CSV" required>
            <Input.TextArea
              rows={6}
              value={csvText}
              onChange={handleCsvChange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleImportCsv}
              disabled={!csvText}
            >
              Import
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuizPage;
