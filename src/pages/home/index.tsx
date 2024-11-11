import React from 'react';
import { Button, Card, Carousel } from 'antd';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <Carousel autoplay arrows style={{ width: '100%', marginTop: 24 }}>
        <div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: '100%', height: '80vh' }}
          >
            <Card style={{ width: '100%', height: '100%' }}>
              <h1 style={{ fontSize: '6em' }} className="text-center">
                QUASH
              </h1>
              <p style={{ fontSize: '3em' }} className="text-center text-muted">
                Quiz x Smash - Smashing every quiz
              </p>
              <div className="d-flex justify-content-center">
                <p
                  style={{ fontSize: '2em', width: '60%' }}
                  className="text-center"
                >
                  Cung cấp giải pháp ôn bài tập trắc nghiệm với hệ thống thi thử
                  thông minh và khả năng đánh dấu trực tiếp trên câu hỏi và các
                  câu trả lời.
                </p>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{ marginTop: 24 }}
              >
                <Link to="/quiz-bundle">
                  <Button
                    type="primary"
                    className="breathe"
                    size="large"
                    style={{
                      width: 144,
                      height: 144,
                      borderRadius: '50%',
                      padding: 24,
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '24px' }}>
                      Khám phá<br></br>ngay!
                    </div>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default HomePage;
