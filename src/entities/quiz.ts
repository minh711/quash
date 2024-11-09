export interface Quiz {
  id: number;
  question: string;
  answer: Answer[];
  correctAnswers: number[];
  answeredCount: number;
  correctAnsweredCount: number;
  incorrectAnsweredCount: number;
  wrathCount: number;
}

export interface Answer {
  id: number;
  content: string;
}
