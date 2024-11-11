import { Quiz, Answer } from '../entities/quiz';
import { v4 as uuidv4 } from 'uuid';

export class ImportQuiz {
  importCsv(csv: string, bundleId: string): Quiz[] {
    const formattedCsv = csv.trim().replace(/\n\n/g, '\n').trim();
    const quizLines = formattedCsv.split(';');
    console.log('TOTAL', quizLines.length - 1);

    const quizzes: Quiz[] = [];
    for (let i = 0; i < quizLines.length - 1; i += 1) {
      const extracted = quizLines[i].split('\n');
      const len = extracted.length;

      const question = extracted[0];
      const answers = [];

      for (let j = 1; j < len - 1; j++) {
        answers.push({ id: uuidv4(), content: extracted[j] });
      }

      const parts = extracted[len - 1].split(',');
      const correctAnswer = parts.pop();
      const lastAnswer = parts.join(',');
      answers.push({ id: uuidv4(), content: lastAnswer });

      const quiz: Quiz = {
        id: uuidv4(),
        question,
        answers,
        correctAnswers: [], // Assume empty for now
        answeredCount: 0,
        correctAnsweredCount: 0,
        incorrectAnsweredCount: 0,
        wrathCount: 0,
        tags: [],
        groups: [],
        quizBundleId: bundleId,
      };

      quizzes.push(quiz);
    }
    return quizzes;
  }
}
