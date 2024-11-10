import { Quiz } from '../entities/quiz';

export class QuizRepository {
  private quizzes: Quiz[] = JSON.parse(localStorage.getItem('quizzes') || '[]');

  add(quiz: Quiz) {
    const newQuiz = {
      ...quiz,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quizzes.push(newQuiz);
    this.updateLocalStorage();
  }

  getAll(): Quiz[] {
    return this.quizzes.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : -Infinity; // Treat null as very old date
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : -Infinity; // Treat null as very old date

      return dateB - dateA; // Newest first
    });
  }

  getById(id: string): Quiz | undefined {
    return this.quizzes.find((quiz) => quiz.id === id);
  }

  delete(id: string) {
    this.quizzes = this.quizzes.filter((quiz) => quiz.id !== id);
    this.updateLocalStorage();
  }

  update(updatedQuiz: Quiz) {
    const index = this.quizzes.findIndex((quiz) => quiz.id === updatedQuiz.id);
    if (index !== -1) {
      this.quizzes[index] = {
        ...updatedQuiz,
        updatedAt: new Date(),
      };
      this.updateLocalStorage();
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('quizzes', JSON.stringify(this.quizzes));
  }
}
