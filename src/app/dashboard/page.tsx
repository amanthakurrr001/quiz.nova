'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useQuizData } from '@/hooks/useQuizData';

export default function DashboardPage() {
    const { user } = useAuth();
    const { quizzes, isLoading } = useQuizData();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user?.isGuest ? (
                <p>Welcome, Guest! Create quizzes and test your knowledge.</p>
            ) : (
                <p>Welcome back, {user?.name}! Manage your quizzes and track your progress.</p>
            )}

            <div className="grid gap-6 md:grid-cols-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Create Manual Quiz</CardTitle>
                        <CardDescription>Build your own quiz question by question.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild>
                            <Link href="/dashboard/create">New Manual Quiz</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {!user?.isGuest && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Quiz History</CardTitle>
                        <CardDescription>View your past quizzes and results.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p>Loading quiz history...</p>
                        ) : quizzes.length > 0 ? (
                            <ul className="space-y-2">
                                {quizzes.slice(0, 3).map((quiz) => (
                                    <li key={quiz.id} className="flex justify-between items-center">
                                        <span>{quiz.topic}</span>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/dashboard/quiz/${quiz.id}`}>Play</Link>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Your quiz history will appear here.</p>
                        )}
                        <Button variant="outline" className="mt-4" asChild>
                           <Link href="/dashboard/history">View All History</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
