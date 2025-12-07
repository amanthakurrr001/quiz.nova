'use client';

import { useForm, zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

const onboardingSchema = z.object({
  name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  profession: z.string().optional(),
  age: z.coerce.number().positive().int().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding, isAuthenticated, isLoading, isOnboarded } = useAuth();
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: user?.name || '',
      profession: '',
    },
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (isOnboarded && !user?.isGuest) {
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, isOnboarded, user, router]);
  
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        profession: user.profession || '',
        age: user.age
      })
    }
  }, [user, form]);

  const onSubmit = (data: OnboardingFormValues) => {
    completeOnboarding(data);
    router.push('/dashboard');
  };

  if (isLoading || !isAuthenticated || (isOnboarded && !user?.isGuest)) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to QuizGenius!</CardTitle>
          <CardDescription>Let's set up your profile. Just a few details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name (Mandatory)</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Student, Developer, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25" {...field} onChange={event => field.onChange(+event.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Continue to Dashboard
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
