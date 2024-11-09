import { Quiz } from '../entities/quiz';

class QuizRepository {
  private quizzes: Quiz[] = [];

  add(quiz: Quiz) {
    this.quizzes.push(quiz);
  }

  getAll(): Quiz[] {
    return this.quizzes;
  }

  getById(id: number): Quiz | undefined {
    return this.quizzes.find((quiz) => quiz.id === id);
  }

  delete(id: number) {
    this.quizzes = this.quizzes.filter((quiz) => quiz.id !== id);
  }

  update(updatedQuiz: Quiz) {
    const index = this.quizzes.findIndex((quiz) => quiz.id === updatedQuiz.id);
    if (index !== -1) {
      this.quizzes[index] = updatedQuiz;
    }
  }
}

export default QuizRepository;
