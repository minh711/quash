export interface User {
  id: number;
  name: string;
  score: number;
  uploadedQuizCount: number;
  answeredQuizCount: number;
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  wrathCount: number;
  topCorrectPerQuizCount: number;
  topIncorrectPerQuizCount: number;
  topWrathPerQuizCount: number;
}
