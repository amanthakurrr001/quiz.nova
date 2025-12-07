'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Quiz, QuizResult } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const QUIZZES_KEY = 'quizgenius-quizzes';
const RESULTS_KEY = 'quizgenius-results';

export function useQuizData() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedQuizzes = localStorage.getItem(QUIZZES_KEY);
      const storedResults = localStorage.getItem(RESULTS_KEY);
      if (storedQuizzes) {
        setQuizzes(JSON.parse(storedQuizzes));
      }
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const saveQuizzesToStorage = useCallback((quizzesToSave: Quiz[]) => {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzesToSave));
  }, []);

  const saveResultsToStorage = useCallback((resultsToSave: QuizResult[]) => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(resultsToSave));
  }, []);

  const addQuiz = useCallback((quiz: Omit<Quiz, 'id' | 'dateCreated'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: uuidv4(),
      dateCreated: new Date().toISOString(),
    };
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    saveQuizzesToStorage(updatedQuizzes);
    return newQuiz;
  }, [quizzes, saveQuizzesToStorage]);
  
  const getQuizById = useCallback((id: string) => {
    return quizzes.find(q => q.id === id);
  }, [quizzes]);

  const addResult = useCallback((resultData: Omit<QuizResult, 'id' | 'dateTaken'>) => {
    const newResult: QuizResult = {
      ...resultData,
      id: uuidv4(),
      dateTaken: new Date().toISOString(),
    };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    saveResultsToStorage(updatedResults);
    return newResult;
  }, [results, saveResultsToStorage]);
  
  const getResultById = useCallback((id: string) => {
    return results.find(r => r.id === id);
  }, [results]);

  const getResultsForQuiz = useCallback((quizId: string) => {
    return results.filter(r => r.quizId === quizId).sort((a, b) => new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime());
  }, [results]);
  
  const getLastQuizResult = useCallback((quizId: string) => {
    const quizResults = getResultsForQuiz(quizId);
    return quizResults.length > 0 ? quizResults[0] : null;
  }, [getResultsForQuiz]);

  return {
    quizzes,
    results,
    isLoading,
    addQuiz,
    getQuizById,
    addResult,
    getResultById,
    getResultsForQuiz,
    getLastQuizResult,
  };
}
