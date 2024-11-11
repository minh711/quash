import { Quiz, Answer } from '../entities/quiz';
import { v4 as uuidv4 } from 'uuid';

export class ImportQuiz {
  importCsv(csv: string, bundleId: string): Quiz[] {
    const formattedCsv = csv.trim().replace(/\n\n/g, '\n').trim();
    const quizLines = formattedCsv.split(';');

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

      const [processedAnswers, processedCorrectAnswers] = this.processInput(
        answers,
        correctAnswer ?? ''
      );

      const quiz: Quiz = {
        id: uuidv4(),
        question,
        answers: processedAnswers,
        correctAnswers: processedCorrectAnswers,
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

  private processInput(
    answers: Answer[],
    correctAnswerPrefix: string
  ): [Answer[], string[]] {
    const correctAnswerIds: string[] = [];

    const normalizedCorrectAnswer =
      this.normalizeCorrectAnswer(correctAnswerPrefix);

    const processedAnswers = answers.map((answer) => {
      const prefixMatch = answer.content.match(/^[([]?[a-dA-D]{1}[)\]]?\.?\s*/);
      let processedContent = answer.content;

      const prefix = processedContent.match(/^[([]?[a-dA-D]{1}[)\]]?\.?\s*/);
      if (prefix) {
        const prefixValue = prefix[0].replace(/[^a-dA-D]/gi, '').toUpperCase();
        if (normalizedCorrectAnswer.includes(prefixValue)) {
          correctAnswerIds.push(answer.id);
        }
      }

      if (prefixMatch) {
        processedContent = processedContent
          .replace(/^[([]?[a-dA-D]{1}[)\]]?\.?\s*/i, '')
          .trim();
      }

      return { ...answer, content: processedContent };
    });

    return [processedAnswers, correctAnswerIds];
  }

  private normalizeCorrectAnswer(correctAnswer: string): string[] {
    return correctAnswer
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .replace(/[.,;]+/g, ' ')
      .replace(/\s+/g, ' ')
      .split(/[\n\s\-và]+/)
      .map((prefix) => prefix.trim().toUpperCase());
  }
}
