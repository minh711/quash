import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Button,
  Input,
  Row,
  Col,
  Collapse,
  Modal,
  Form,
  Tour,
  InputNumber,
  Tooltip,
  Menu,
  Select,
} from 'antd';
import { Answer, Quiz, QuizBundle, QuizHistory } from '../../entities/quiz';
import RichTextEditor from '../../components/rich-text-editor';
import { DataSource } from '../../scripts/data-source';
import { v4 as uuidv4 } from 'uuid';
import QuizList from '../../components/quiz-list';
import { message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { CaretRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import QuizHistoryChart from '../../components/quiz-history-chart';

const { Panel } = Collapse;

const QuizPage: React.FC = () => {
  const ref1 = useRef(null);
  const steps = [
    {
      title: 'Tạo câu hỏi mới',
      description: 'Bạn có thể điền câu hỏi mới một cách thủ công ở đây.',
      target: () => ref1.current,
    },
  ];

  const { id } = useParams();
  console.log(id);
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
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>(() => {
    const storedHistory = localStorage.getItem(`${quizBundleId}-history`);
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

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
      let importedQuizCount = 0;

      if (csvText.trim().startsWith('[{')) {
        const jsonData = JSON.parse(csvText.trim());
        jsonData.forEach((item: Quiz) => {
          item.quizBundleId = quizBundle.id;
        });
        localStorage.setItem(quizBundle.id, JSON.stringify(jsonData));
        importedQuizCount = jsonData.length;
        localStorage.setItem(
          `${quizBundle.id}-count`,
          importedQuizCount.toString()
        );
      } else {
        importedQuizCount = quizRepository.importCsvData(
          csvText,
          quizBundle.id
        );
      }

      if (importedQuizCount === 0) {
        message.error('Có lỗi xảy ra, kiểm tra lại dữ liệu đầu vào');
      } else {
        message.success('Nhập dữ liệu thành công');
      }
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

  const [open, setOpen] = useState(false);

  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(
    Number(localStorage.getItem(`${quizBundleId}-count`)) > 10
      ? 10
      : Number(localStorage.getItem(`${quizBundleId}-count`))
  );

  const handleInputQuestionChange = (value: number | null) => {
    setNumberOfQuestions(value ?? 1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div style={{ marginBottom: 8 }}>
          <div className="d-flex align-items-end">
            <h2 style={{ marginBottom: 0, marginRight: 16 }}>
              {quizBundle.name}
            </h2>
            <Button
              icon={<QuestionCircleOutlined />}
              color="danger"
              variant="solid"
              onClick={() => setOpen(true)}
            >
              Hướng dẫn sử dụng
            </Button>
          </div>
          <p className="text-muted">{quizBundle.description}</p>
        </div>

        <Button
          color="danger"
          size="large"
          variant="solid"
          className="breathe"
          onClick={() => setIsCsvModalVisible(true)}
        >
          Tải câu hỏi lên
        </Button>
      </div>
      {Number(localStorage.getItem(`${quizBundleId}-count`)) > 0 && (
        <div>
          <Card title="Kiểm tra" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col lg={12} md={24} xs={24}>
                <Card style={{ width: '100%', height: '100%' }}>
                  <div>
                    <Form>
                      <Form.Item label="Nhập số lượng câu hỏi">
                        <InputNumber
                          min={1}
                          max={
                            Number(
                              localStorage.getItem(`${quizBundleId}-count`)
                            ) ?? null
                          }
                          value={numberOfQuestions}
                          onChange={handleInputQuestionChange}
                        />
                      </Form.Item>
                    </Form>
                  </div>
                  <div style={{ paddingBottom: 24 }}>
                    <h3>Chọn chế độ</h3>
                    <Card>
                      <Row
                        gutter={[16, 16]}
                        justify="space-between"
                        style={{ marginTop: 48, marginBottom: 48 }}
                      >
                        <Col xs={24} sm={8} lg={8}>
                          <Tooltip title="Cho phép bạn thoải mái xem Gợi ý cũng như chỉnh sửa câu hỏi trong lúc làm">
                            <Link
                              to={`/practice/${quizBundleId}/1/${numberOfQuestions}`}
                            >
                              <Button
                                type="primary"
                                size="large"
                                style={{
                                  backgroundColor: '#73d13d',
                                  width: 128,
                                  height: 128,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  margin: '0 auto',
                                  fontWeight: 'bold',
                                  fontSize: '1.6em',
                                }}
                                className="breathe"
                              >
                                DỄ
                              </Button>
                            </Link>
                          </Tooltip>
                        </Col>
                        <Col xs={24} sm={8} lg={8}>
                          <Tooltip title="Bạn vẫn có thể biết được đáp án khi làm xong">
                            <Link
                              to={`/practice/${quizBundleId}/2/${numberOfQuestions}`}
                            >
                              <Button
                                type="primary"
                                size="large"
                                style={{
                                  backgroundColor: '#9254de',
                                  width: 128,
                                  height: 128,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  margin: '0 auto',
                                  fontWeight: 'bold',
                                  fontSize: '1.6em',
                                }}
                                className="breathe"
                              >
                                THƯỜNG
                              </Button>
                            </Link>
                          </Tooltip>
                        </Col>
                        <Col xs={24} sm={8} lg={8}>
                          <Tooltip title="Đáp án không được hiển thị ở chế độ này">
                            <Link
                              to={`/practice/${quizBundleId}/3/${numberOfQuestions}`}
                            >
                              <Button
                                style={{
                                  backgroundColor: '#610b00',
                                  width: 128,
                                  height: 128,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  margin: '0 auto',
                                  fontWeight: 'bold',
                                  fontSize: '1.6em',
                                }}
                                type="primary"
                                size="large"
                                className="breathe"
                              >
                                KHÓ
                              </Button>
                            </Link>
                          </Tooltip>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Card>
              </Col>
              <Col lg={12} md={24} xs={24}>
                <Card>
                  <h3>Thống kê</h3>
                  <QuizHistoryChart data={quizHistory} />
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      )}

      <Collapse
        ref={ref1}
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
        <QuizList quizzes={quizzes} quizBundleId={quizBundleId!} />
      </Row>
      {/* Import CSV Modal */}
      <Modal
        title="Tải câu hỏi lên"
        open={isCsvModalVisible}
        onCancel={() => setIsCsvModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Dán dữ liệu CSV hoặc JSON vào đây" required>
            <Input.TextArea
              rows={6}
              value={csvText}
              onChange={handleCsvChange}
            />
          </Form.Item>
          <Form.Item>
            <Tooltip title="Nếu dữ liệu quá nhiều, quá trình sẽ tốn thời gian giây lát, vui lòng kiên nhẫn đợi cho đến khi xong hoàn toàn">
              <Button
                type="primary"
                onClick={handleImportCsv}
                disabled={!csvText}
              >
                Bắt đầu nhập dữ liệu
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </Modal>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        mask={false}
        type="primary"
        steps={steps}
      />
    </div>
  );
};

export default QuizPage;
