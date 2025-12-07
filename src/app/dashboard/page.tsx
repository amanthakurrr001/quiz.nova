'use client';

import { ApiKeyManager } from '@/components/dashboard/ApiKeyManager';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user?.isGuest ? (
                <p>Welcome, Guest! Generate AI quizzes and test your knowledge.</p>
            ) : (
                <p>Welcome back, {user?.name}! Manage your quizzes and track your progress.</p>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Generate AI Quiz</CardTitle>
                        <CardDescription>Create a new quiz on any topic using AI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/dashboard/generate">New AI Quiz</Link>
                        </Button>
                    </CardContent>
                </Card>

                {!user?.isGuest && (
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
                )}
            </div>

            <ApiKeyManager />

            {!user?.isGuest && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Quiz History</CardTitle>
                        <CardDescription>View your past quizzes and results.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for quiz history list */}
                        <p className="text-muted-foreground">Your quiz history will appear here.</p>
                        <Button variant="outline" className="mt-4" asChild>
                           <Link href="/dashboard/history">View All History</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
