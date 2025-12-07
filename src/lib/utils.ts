import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Quiz, Question } from "./types";
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseQuizJson(jsonString: string, topic: string, difficulty: 'easy' | 'medium' | 'hard', numQuestions: number): Quiz | null {
  try {
    const rawQuiz = JSON.parse(jsonString);
    const questions: Question[] = [];

    for (let i = 1; i <= numQuestions; i++) {
      const questionText = rawQuiz[`question${i}`];
      const correctAnswer = rawQuiz[`correct_answer${i}`];
      
      if (!questionText || !correctAnswer) {
        continue;
      }

      const options: string[] = [];
      let j = 1;
      while (rawQuiz[`answer${i}_${j}`]) {
        options.push(rawQuiz[`answer${i}_${j}`]);
        j++;
      }

      if (options.length > 0) {
        questions.push({
          id: uuidv4(),
          questionText,
          options,
          correctAnswer,
        });
      }
    }

    if (questions.length > 0) {
      return {
        id: uuidv4(),
        topic,
        questions,
        dateCreated: new Date().toISOString(),
        difficulty,
        numQuestions,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to parse quiz JSON:", error);
    return null;
  }
}
