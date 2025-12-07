'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const demoQuiz = {
  topic: 'Science',
  questions: [
    {
      id: 'q1',
      questionText: 'What is the chemical symbol for water?',
      options: ['O2', 'H2O', 'CO2', 'NaCl'],
      correctAnswer: 'H2O',
    },
    {
      id: 'q2',
      questionText: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
    },
    {
      id: 'q3',
      questionText: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
      correctAnswer: 'Mitochondrion',
    },
  ],
};

type AnswersState = { [key: string]: string };

export default function QuizDemo() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = demoQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / demoQuiz.questions.length) * 100;

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < demoQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsFinished(false);
  };

  const results = useMemo(() => {
    if (!isFinished) return null;
    const correctCount = demoQuiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const incorrectCount = demoQuiz.questions.length - correctCount;
    const score = (correctCount / demoQuiz.questions.length) * 100;
    return {
      score: Math.round(score),
      chartData: [
        { name: 'Correct', value: correctCount, fill: 'hsl(var(--accent))' },
        { name: 'Incorrect', value: incorrectCount, fill: 'hsl(var(--destructive))' },
      ],
    };
  }, [isFinished, answers]);

  return (
    <section className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Experience It Live
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Try our interactive demo to see how QuizGenius works.
          </p>
        </div>
        <div className="mt-12">
          <Card className="mx-auto max-w-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{!isFinished ? demoQuiz.topic : 'Demo Results'}</CardTitle>
            </CardHeader>
            <CardContent>
              {!isFinished ? (
                <div>
                  <Progress value={progress} className="mb-4" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {demoQuiz.questions.length}
                  </p>
                  <h3 className="mb-6 text-lg font-semibold">{currentQuestion.questionText}</h3>
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                        <Label htmlFor={`${currentQuestion.id}-${index}`} className="text-base">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button onClick={handleNext} className="mt-6 w-full" disabled={!answers[currentQuestion.id]}>
                    {currentQuestionIndex < demoQuiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary">{results?.score}%</h3>
                  <p className="text-muted-foreground">Your Score</p>
                  <div className="h-64 mt-8">
                     <ChartContainer config={{}} className="h-full w-full">
                        <BarChart accessibilityLayer data={results?.chartData} layout="vertical" margin={{left: 20}}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))' }} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                          <Bar dataKey="value" radius={5}>
                             <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                  </div>
                  <Button onClick={handleRestart} className="mt-8">
                    Restart Demo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
