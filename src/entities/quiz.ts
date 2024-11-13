export interface QuizTag {
  id: string;
  name: string;
}

export interface QuizGroup {
  id: string;
  name: string;
}

export interface Quiz {
  id: string;
  question: string;
  answers: Answer[];
  correctAnswers: string[];
  answeredCount: number;
  correctAnsweredCount: number;
  incorrectAnsweredCount: number;
  wrathCount: number;
  tags: QuizTag[];
  groups: QuizGroup[];
  createdAt?: Date;
  updatedAt?: Date;
  quizBundleId?: string;
}

export interface Answer {
  id: string;
  content: string;
}

export interface QuizBundle {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPreset: boolean;
}

export interface QuizHistory {
  id: string;
  createdAt: Date;
  answeredCount: number;
  correctAnsweredCount: number;
  incorrectAnsweredCount: number;
}
