'use client';

import { useQuizData } from '@/hooks/useQuizData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HistoryPage() {
    const { quizzes, isLoading, getLastQuizResult } = useQuizData();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user?.isGuest) {
            router.replace('/dashboard');
        }
    }, [user, router]);

    if (user?.isGuest) {
        return null;
    }

    if (isLoading) {
        return <p>Loading history...</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Quiz History</h1>
            {quizzes.length === 0 ? (
                <p>You haven't created or played any quizzes yet.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => {
                        const lastResult = getLastQuizResult(quiz.id);
                        return (
                            <Card key={quiz.id}>
                                <CardHeader>
                                    <CardTitle>{quiz.topic}</CardTitle>
                                    <CardDescription>
                                        Created on {format(new Date(quiz.dateCreated), 'PPP')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{quiz.numQuestions} questions - {quiz.difficulty}</p>
                                    {lastResult && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Last score: {lastResult.score}%
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button asChild>
                                        <Link href={`/dashboard/quiz/${quiz.id}`}>Play Again</Link>
                                    </Button>
                                    {lastResult && (
                                        <Button variant="outline" asChild>
                                            <Link href={`/dashboard/quiz/${quiz.id}/results?resultId=${lastResult.id}`}>View Last Result</Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
