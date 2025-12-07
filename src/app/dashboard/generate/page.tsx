'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateQuizFromTopic } from '@/ai/flows/generate-quiz-from-topic';
import { parseQuizJson } from '@/lib/utils';
import { useQuizData } from '@/hooks/useQuizData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const generateQuizSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  numQuestions: z.number().min(1).max(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type GenerateQuizFormValues = z.infer<typeof generateQuizSchema>;

export default function GenerateQuizPage() {
  const router = useRouter();
  const { addQuiz } = useQuizData();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateQuizFormValues>({
    resolver: zodResolver(generateQuizSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      difficulty: 'medium',
    },
  });

  const onSubmit = async (data: GenerateQuizFormValues) => {
    if (!user?.apiKey) {
      toast({
        variant: 'destructive',
        title: 'API Key Missing',
        description: 'Please add your Gemini API key on the dashboard to generate quizzes.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Set API key for the flow
      process.env.GEMINI_API_KEY = user.apiKey;
      
      const result = await generateQuizFromTopic(data);
      const quizData = parseQuizJson(result.quiz, data.topic, data.difficulty, data.numQuestions);
      
      if (quizData) {
        const newQuiz = addQuiz(quizData);
        toast({
          title: 'Quiz Generated!',
          description: `Your quiz on ${data.topic} is ready.`,
        });
        router.push(`/dashboard/quiz/${newQuiz.id}`);
      } else {
        throw new Error('Failed to parse the generated quiz data.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your quiz. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate AI Quiz</CardTitle>
        <CardDescription>Let AI create a custom quiz for you on any topic.</CardDescription>
      </CardHeader>
      <CardContent>
        {!user?.apiKey && (
            <Alert variant="destructive" className="mb-6">
                <AlertTitle>API Key Required</AlertTitle>
                <AlertDescription>
                    You need to set your Gemini API key on the dashboard before you can generate AI quizzes.
                </AlertDescription>
            </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Solar System, Shakespearean Plays" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isGenerating || !user?.apiKey} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Quiz'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
