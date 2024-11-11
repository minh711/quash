import { Quiz } from '../entities/quiz';
import { ImportQuiz } from './import-quiz';

export class QuizRepository {
  private importQuiz: ImportQuiz;

  constructor() {
    this.importQuiz = new ImportQuiz();
    this.migrateOldQuizzes();
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

  importCsvData(csv: string, bundleId: string) {
    const importedQuizzes = this.importQuiz.importCsv(csv, bundleId);
    importedQuizzes.forEach((quiz) => this.add(quiz));
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

  getByBundleId(bundleId: string, page = 1, pageSize = 10): Quiz[] {
    const quizzesForBundle = this.getQuizzesForBundle(bundleId);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return quizzesForBundle
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
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
