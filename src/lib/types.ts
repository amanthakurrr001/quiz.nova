export type Question = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
};

export type Quiz = {
  id: string;
  topic: string;
  dateCreated: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
};

export type QuizResult = {
  id: string;
  quizId: string;
  quizTopic: string;
  score: number;
  userAnswers: { [key: string]: string };
  correctAnswers: { [key: string]: string };
  dateTaken: string;
};

export type User = {
  name: string;
  email: string;
  profession?: string;
  age?: number;
  apiKey?: string;
  isGuest?: boolean;
};
