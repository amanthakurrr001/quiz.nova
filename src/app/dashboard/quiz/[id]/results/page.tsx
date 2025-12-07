'use client';

import { useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQuizData } from '@/hooks/useQuizData';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function QuizResultsPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    
    const quizId = params.id as string;
    const resultId = searchParams.get('resultId');
    
    const { getQuizById, getResultById, quizzes, results } = useQuizData();

    const quiz = useMemo(() => getQuizById(quizId), [quizId, getQuizById, quizzes]);
    const result = useMemo(() => getResultById(resultId!), [resultId, getResultById, results]);

    const chartData = useMemo(() => {
        if (!result || !quiz) return [];
        const correctCount = quiz.questions.filter(q => result.userAnswers[q.id] === q.correctAnswer).length;
        const incorrectCount = quiz.questions.length - correctCount;
        return [
            { name: 'Correct', value: correctCount, fill: 'hsl(var(--accent))' },
            { name: 'Incorrect', value: incorrectCount, fill: 'hsl(var(--destructive))' },
        ];
    }, [result, quiz]);

    if (!quiz || !result) {
        return <div>Result not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Results for {quiz.topic}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <h3 className="text-6xl font-bold text-primary">{result.score}%</h3>
                    <p className="text-muted-foreground">Your Score</p>
                    <div className="h-64 w-full max-w-sm mt-8">
                        <ChartContainer config={{}} className="h-full w-full">
                            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{left: 20}}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))' }} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="value" radius={5}>
                                    <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button onClick={() => router.push(`/dashboard/quiz/${quiz.id}`)}>Play Again</Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Review Your Answers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {quiz.questions.map((question, index) => {
                        const userAnswer = result.userAnswers[question.id];
                        const isCorrect = userAnswer === question.correctAnswer;
                        return (
                            <div key={question.id}>
                                <div className="flex items-start gap-4">
                                    {isCorrect ? (
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-semibold">{question.questionText}</p>
                                        <p className={cn("text-sm", isCorrect ? "text-green-600" : "text-destructive")}>
                                            Your answer: {userAnswer}
                                        </p>
                                        {!isCorrect && (
                                            <p className="text-sm text-green-600">Correct answer: {question.correctAnswer}</p>
                                        )}
                                    </div>
                                </div>
                                {index < quiz.questions.length - 1 && <Separator className="mt-6" />}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
