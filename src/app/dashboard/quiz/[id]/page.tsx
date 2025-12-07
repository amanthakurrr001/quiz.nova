'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuizData } from '@/hooks/useQuizData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type AnswersState = { [key: string]: string };

export default function PlayQuizPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { getQuizById, addResult, quizzes } = useQuizData();
    
    const quiz = useMemo(() => getQuizById(id as string), [id, getQuizById, quizzes]);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<AnswersState>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (quizzes.length > 0) {
            setIsLoading(false);
        }
    }, [quizzes]);

    if (isLoading) {
        return <div>Loading quiz...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found.</div>;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            // Finish quiz and save results
            const correctAnswers: { [key: string]: string } = {};
            let score = 0;
            quiz.questions.forEach(q => {
                correctAnswers[q.id] = q.correctAnswer;
                if (answers[q.id] === q.correctAnswer) {
                    score++;
                }
            });
            const finalScore = (score / quiz.questions.length) * 100;
            
            const result = addResult({
                quizId: quiz.id,
                quizTopic: quiz.topic,
                score: Math.round(finalScore),
                userAnswers: answers,
                correctAnswers: correctAnswers,
            });

            router.push(`/dashboard/quiz/${quiz.id}/results?resultId=${result.id}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{quiz.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Progress value={progress} className="mb-4" />
                        <p className="mb-1 text-sm text-muted-foreground">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </p>
                        <h3 className="mb-6 text-lg font-semibold">{currentQuestion.questionText}</h3>
                        <RadioGroup
                            value={answers[currentQuestion.id] || ''}
                            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                            className="space-y-3"
                        >
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                                    <Label htmlFor={`${currentQuestion.id}-${index}`} className="text-base font-normal">{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <Button onClick={handleNext} className="mt-6 w-full" disabled={!answers[currentQuestion.id]}>
                            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
