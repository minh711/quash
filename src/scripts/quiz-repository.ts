import { Quiz } from '../entities/quiz';
import { ImportQuiz } from './import-quiz';

export class QuizRepository {
  private importQuiz: ImportQuiz;

  constructor() {
    this.importQuiz = new ImportQuiz();
    this.migrateOldQuizzes();
    this.migratePresetQuizzes();
  }

  private migratePresetQuizzes() {
    if (
      localStorage.getItem('preset-bundle-count') !== null ||
      localStorage.getItem('preset-bundle-count') === '0'
    ) {
      return;
    }

    this.importCsvData(
      `Thủ đô của Pháp là gì?
A. Berlin
B. Paris
C. Madrid
D. Rome,B;Ai là tác giả của "Romeo và Juliet"?
A. Charles Dickens
B. Leo Tolstoy
C. William Shakespeare
D. Mark Twain,C;Núi nào cao nhất thế giới?
A. Kilimanjaro
B. Everest
C. Fuji
D. Denali,B;Ai là nhà khoa học phát hiện ra thuyết tương đối?
A. Isaac Newton
B. Albert Einstein
C. Nikola Tesla
D. Galileo Galilei,B;Kim tự tháp nổi tiếng của Ai Cập là gì?
A. Kim Tự Tháp Giza
B. Kim Tự Tháp Angkor
C. Kim Tự Tháp Machu Picchu
D. Kim Tự Tháp Taj Mahal,A;Đơn vị tiền tệ của Nhật Bản là gì?
A. Won
B. Baht
C. Yen
D. Peso,C;Bức tranh "Mona Lisa" được vẽ bởi ai?
A. Pablo Picasso
B. Vincent van Gogh
C. Leonardo da Vinci
D. Claude Monet,C;Đại dương nào lớn nhất trên Trái Đất?
A. Đại Tây Dương
B. Ấn Độ Dương
C. Thái Bình Dương
D. Bắc Băng Dương,C;Ai phát minh ra bóng đèn?
A. Thomas Edison
B. Alexander Graham Bell
C. Nikola Tesla
D. Benjamin Franklin,A;Thành phố nào được gọi là "Big Apple"?
A. Los Angeles
B. New York
C. San Francisco
D. Chicago,B;Hành tinh nào được gọi là Hành tinh Đỏ?
A. Sao Hỏa
B. Sao Kim
C. Sao Mộc
D. Sao Thổ,A;Kí hiệu hóa học của nước là gì?
A. O2
B. H2O
C. CO2
D. NaCl,B;Loài vật nào được xem là "vua của rừng xanh"?
A. Hổ
B. Voi
C. Sư tử
D. Gấu,C;Bộ phim nào được lấy bối cảnh trên con tàu Titanic?
A. Titanic
B. Avatar
C. Inception
D. The Godfather,A;Người phát minh ra máy bay là ai?
A. Nikola Tesla
B. Wright Brothers
C. Thomas Edison
D. Alexander Bell,B;`,
      'preset-bundle'
    );

    localStorage.setItem('preset-bundle-count', '15');
  }

  private migrateOldQuizzes() {
    const quizzesFromStorage = JSON.parse(
      localStorage.getItem('quizzes') || '[]'
    );

    if (quizzesFromStorage.length > 0) {
      const migratedQuizzes = quizzesFromStorage.map((quiz: any) => ({
        ...quiz,
        quizBundleId: 'old-quizzes',
      }));

      localStorage.setItem('old-quizzes', JSON.stringify(migratedQuizzes));

      localStorage.setItem(
        'old-quizzes-count',
        migratedQuizzes.length.toString()
      );

      localStorage.removeItem('quizzes');
    }
  }

  importCsvData(csv: string, bundleId: string): number {
    const importedQuizzes = this.importQuiz.importCsv(csv, bundleId);
    importedQuizzes.forEach((quiz) => this.add(quiz));

    return importedQuizzes.length;
  }

  add(quiz: Quiz) {
    const newQuiz = { ...quiz, createdAt: new Date(), updatedAt: new Date() };
    const bundleId = quiz.quizBundleId || 'default-bundle';

    this.updateLocalStorage(bundleId, newQuiz);
    this.incrementQuizCount(bundleId);
  }

  getById(id: string, bundleId: string): Quiz | undefined {
    const quizzesForBundle = this.getQuizzesForBundle(bundleId);
    return quizzesForBundle.find((quiz: any) => quiz.id === id);
  }

  private removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getByBundleId(
    bundleId: string,
    page = 1,
    pageSize = 10,
    sortBy:
      | 'createdAt'
      | 'updatedAt'
      | 'wrathCount'
      | 'incorrectAnsweredCount'
      | 'correctAnswers'
      | 'answeredCount' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    searchText = ''
  ): Quiz[] {
    const quizzesForBundle = this.getQuizzesForBundle(bundleId);

    // Remove accents and normalize search text
    const normalizedSearchText = this.removeAccents(searchText.toLowerCase());

    // Filter quizzes based on search text
    const filteredQuizzes = quizzesForBundle.filter((quiz) => {
      const normalizedQuestion = this.removeAccents(
        quiz.question.toLowerCase()
      );
      const questionMatch = normalizedQuestion.includes(normalizedSearchText);

      const answerMatch = quiz.answers.some((answer) =>
        this.removeAccents(answer.content.toLowerCase()).includes(
          normalizedSearchText
        )
      );

      return questionMatch || answerMatch;
    });

    // Sort filtered quizzes based on sort criteria
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredQuizzes
      .sort((a: any, b: any) => {
        let comparison = 0;

        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
          const dateA = new Date(a[sortBy] || 0).getTime();
          const dateB = new Date(b[sortBy] || 0).getTime();
          comparison = dateA - dateB;
        } else {
          comparison = a[sortBy] - b[sortBy];
        }

        return order === 'asc' ? comparison : -comparison;
      })
      .slice(startIndex, endIndex);
  }

  delete(id: string, bundleId: string) {
    const quizzesForBundle = this.getQuizzesForBundle(bundleId);
    const updatedQuizzes = quizzesForBundle.filter(
      (quiz: any) => quiz.id !== id
    );
    this.updateLocalStorage(bundleId, updatedQuizzes);
    this.decrementQuizCount(bundleId);
  }

  update(updatedQuiz: Quiz) {
    const quizzesForBundle = this.getQuizzesForBundle(
      updatedQuiz.quizBundleId!
    );
    const index = quizzesForBundle.findIndex(
      (quiz: any) => quiz.id === updatedQuiz.id
    );

    if (index !== -1) {
      quizzesForBundle[index] = { ...updatedQuiz, updatedAt: new Date() };
      this.updateLocalStorage(updatedQuiz.quizBundleId!, quizzesForBundle);
    }
  }

  getPracticeQuiz(
    previousQuizIds: string[],
    bundleId: string
  ): Quiz | undefined {
    const quizzesForBundle = this.getQuizzesForBundle(bundleId).filter(
      (quiz) =>
        !previousQuizIds.includes(quiz.id) && quiz.correctAnswers.length > 0 // Exclude quizzes with no correct answers
    );

    if (quizzesForBundle.length === 0) return undefined;

    // Get top 5 quizzes with highest wrathCount
    const topWrathQuizzes = [...quizzesForBundle]
      .sort((a, b) => b.wrathCount - a.wrathCount)
      .slice(0, 5);

    // Get top 5 quizzes with lowest answeredCount
    const topAnsweredQuizzes = [...quizzesForBundle]
      .sort((a, b) => a.answeredCount - b.answeredCount)
      .slice(0, 5);

    // Combine both top lists
    const combinedTopQuizzes = [...topWrathQuizzes, ...topAnsweredQuizzes];

    // Get a random quiz from the combined list
    const randomIndex = Math.floor(Math.random() * combinedTopQuizzes.length);
    return combinedTopQuizzes[randomIndex];
  }

  private getQuizzesForBundle(bundleId: string): Quiz[] {
    return JSON.parse(localStorage.getItem(bundleId) || '[]');
  }

  private updateLocalStorage(
    bundleId: string,
    quizzesForBundle: Quiz | Quiz[] = []
  ) {
    const currentQuizzes = JSON.parse(localStorage.getItem(bundleId) || '[]');
    const updatedQuizzes = Array.isArray(quizzesForBundle)
      ? quizzesForBundle
      : [...currentQuizzes, quizzesForBundle];
    localStorage.setItem(bundleId, JSON.stringify(updatedQuizzes));
  }

  private incrementQuizCount(bundleId: string) {
    const currentCount = Number(
      localStorage.getItem(`${bundleId}-count`) || '0'
    );
    localStorage.setItem(`${bundleId}-count`, (currentCount + 1).toString());
  }

  private decrementQuizCount(bundleId: string) {
    const currentCount = Number(
      localStorage.getItem(`${bundleId}-count`) || '0'
    );
    localStorage.setItem(`${bundleId}-count`, (currentCount - 1).toString());
  }
}
