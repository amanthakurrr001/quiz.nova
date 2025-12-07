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
            <div className='flex justify-between items-center'>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                {user?.isGuest ? (
                    <p className="text-muted-foreground">Welcome, Guest!</p>
                ) : (
                    <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
                )}
            </div>


            <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Generate AI Quiz</CardTitle>
                        <CardDescription>Let AI create a quiz for you on any topic.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild>
                            <Link href="/dashboard/generate">New AI Quiz</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Create Manual Quiz</CardTitle>
                        <CardDescription>Build your own quiz question by question.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild disabled={user?.isGuest}>
                            <Link href="/dashboard/create">New Manual Quiz</Link>
                        </Button>
                        {user?.isGuest && <p className="text-xs text-muted-foreground mt-2">Sign up to create quizzes manually.</p>}
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
                                    <li key={quiz.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                                        <span>{quiz.topic}</span>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/quiz/${quiz.id}`}>Play</Link>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Your quiz history will appear here.</p>
                        )}
                        {quizzes.length > 0 && (
                            <Button variant="outline" className="mt-4" asChild>
                            <Link href="/dashboard/history">View All History</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
