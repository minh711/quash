import React, { useState, useEffect } from 'react';
import { Quiz } from '../entities/quiz';
import QuizDisplay from './quiz-display';
import { DataSource } from '../scripts/data-source';
import { Button, Card, Input, Menu, Select } from 'antd';

const { Option } = Select;

interface QuizListProps {
  quizzes: Quiz[];
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  const [quizList, setQuizList] = useState<Quiz[]>(quizzes);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quizBundleId, setQuizBundleId] = useState<string | null>(null);

  // const pageSize = 10;

  const [sortBy, setSortBy] = useState<
    | 'createdAt'
    | 'updatedAt'
    | 'wrathCount'
    | 'incorrectAnsweredCount'
    | 'correctAnswers'
    | null
  >(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isFilter, setIsFilter] = useState(false);

  const handleSortChange = (value: string) => {
    const [newSortBy, newOrder] = value.split('_');
    setSortBy(
      newSortBy as
        | 'createdAt'
        | 'updatedAt'
        | 'wrathCount'
        | 'incorrectAnsweredCount'
        | 'correctAnswers'
    );
    setOrder(newOrder as 'asc' | 'desc');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  const handleSearchAndSort = () => {
    const userRepository = DataSource.getInstance().quizRepository;
    const result = userRepository.getByBundleId(
      quizBundleId!,
      1,
      pageSize,
      sortBy ?? 'createdAt',
      order,
      searchText
    );

    setQuizList(result);
    setQuizCount(result.length);
    setIsFilter(true);
  };

  const handleClearFilter = () => {
    const userRepository = DataSource.getInstance().quizRepository;
    const result = userRepository.getByBundleId(quizBundleId!, 1, pageSize);

    setIsFilter(false);
    setQuizList(result);
  };

  useEffect(() => {
    setQuizList(quizzes);
    setIsFilter(false);

    if (!quizBundleId) {
      setQuizBundleId(quizzes[0].quizBundleId!);
    }
  }, [quizzes]);

  useEffect(() => {
    if (!quizBundleId) {
      setQuizBundleId(quizzes[0].quizBundleId!);
    }

    if (quizList && quizList.length > 0) {
      const count = Number(
        localStorage.getItem(`${quizBundleId}-count`) || '0'
      );
      setQuizCount(count);
    } else {
      setQuizCount(0);
    }
  }, [quizList, quizzes]);

  const [visibleQuizzes, setVisibleQuizzes] = useState(10);

  const handleLoadMore = () => {
    setVisibleQuizzes(visibleQuizzes + 10);

    const nextPage = currentPage + 1;
    const newQuizzes = DataSource.getInstance().quizRepository.getByBundleId(
      quizBundleId!,
      nextPage,
      pageSize,
      sortBy ?? 'createdAt',
      order,
      searchText
    );
    setQuizList((prevQuizzes) => [...prevQuizzes, ...newQuizzes]);
    setCurrentPage(nextPage);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center">
        {!isFilter && (
          <h3>
            Danh sách câu hỏi của bạn
            {quizCount !== 0 ? (
              <span className="text-muted">
                {' '}
                (hiển thị {Math.min(currentPage * pageSize, quizCount)}/
                {quizCount})
              </span>
            ) : (
              <>
                <br></br>
                <div
                  style={{ fontWeight: 'normal', marginTop: 16 }}
                  className="text-muted"
                >
                  Chưa có câu hỏi nào
                </div>
              </>
            )}
          </h3>
        )}

        {isFilter && <h3>Kết quả tìm kiếm</h3>}

        <div>
          <Select
            value={sortBy ? `${sortBy}_${order}` : null}
            onChange={handleSortChange}
            style={{ width: 200, marginRight: 8 }}
            placeholder="Lọc theo"
          >
            <Option value="createdAt_asc">Mới nhất</Option>
            <Option value="createdAt_desc">Cũ nhất</Option>
            <Option value="updatedAt_desc">Cập nhật gần nhất</Option>
            <Option value="wrathCount_asc">Điểm phẫn nộ</Option>
            <Option value="incorrectAnsweredCount_desc">Sai nhiều</Option>
            <Option value="correctAnswers_desc">Đúng nhiều</Option>
            <Option value="answeredCount_desc">Trả lời nhiều</Option>
          </Select>

          <Input
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm"
            allowClear
            style={{ width: 200, marginRight: 8 }}
          />

          <Button
            type="primary"
            onClick={handleSearchAndSort}
            style={{ marginRight: 8 }}
          >
            Lọc
          </Button>
          <Button color="danger" variant="solid" onClick={handleClearFilter}>
            Hủy bộ lọc
          </Button>
        </div>
      </div>

      {isFilter && quizCount == 0 && (
        <Card>
          <div style={{ fontWeight: 'normal' }} className="text-muted">
            Không tìm thấy kết quả nào
          </div>
        </Card>
      )}

      <div>
        {quizList.map((quiz: Quiz) => (
          <QuizDisplay
            key={quiz.id}
            quizId={quiz.id}
            quizBundleId={quiz.quizBundleId!}
          />
        ))}

        {quizCount > visibleQuizzes && (
          <Card>
            <div className="d-flex align-items-center justify-content-center">
              <div>
                {!isFilter && (
                  <div className="text-muted" style={{ textAlign: 'center' }}>
                    {currentPage * pageSize}/{quizCount}
                  </div>
                )}

                <Button
                  type="primary"
                  style={{ marginTop: 8 }}
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizList;
