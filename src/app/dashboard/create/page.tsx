'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuizData } from '@/hooks/useQuizData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const optionSchema = z.object({
  value: z.string().min(1, { message: 'Option cannot be empty.' }),
});

const questionSchema = z.object({
  id: z.string(),
  questionText: z.string().min(1, { message: 'Question cannot be empty.' }),
  options: z.array(optionSchema).min(2, { message: 'Must have at least 2 options.' }),
  correctAnswer: z.string().min(1, { message: 'Please select a correct answer.' }),
});

const quizSchema = z.object({
  topic: z.string().min(1, { message: 'Topic cannot be empty.' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questions: z.array(questionSchema).min(1, { message: 'Must have at least 1 question.' }),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function CreateQuizPage() {
  const router = useRouter();
  const { addQuiz } = useQuizData();
  const { user } = useAuth();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      topic: '',
      difficulty: 'medium',
      questions: [{ id: uuidv4(), questionText: '', options: [{ value: '' }, { value: '' }], correctAnswer: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  if (user?.isGuest) {
      router.replace('/dashboard');
      return null;
  }
  
  const onSubmit = (data: QuizFormValues) => {
    const newQuiz = addQuiz({
      topic: data.topic,
      difficulty: data.difficulty,
      numQuestions: data.questions.length,
      questions: data.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options.map(o => o.value),
        correctAnswer: q.correctAnswer,
      })),
    });
    router.push(`/dashboard/quiz/${newQuiz.id}`);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Quiz</CardTitle>
        <CardDescription>Build your own quiz, question by question.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., World History" {...field} />
                    </FormControl>
                    <FormMessage />
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
            </div>
            
            <Separator />

            <div className="space-y-6">
                <h3 className="text-lg font-medium">Questions</h3>
                {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-muted/50">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <FormField
                                control={form.control}
                                name={`questions.${index}.questionText`}
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Question {index + 1}</FormLabel>
                                    <FormControl>
                                    <Input placeholder="What is the capital of...?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="ml-4 mt-8">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>

                        <QuestionOptions control={form.control} questionIndex={index} />
                    </div>
                    </Card>
                ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ id: uuidv4(), questionText: '', options: [{ value: '' }, { value: '' }], correctAnswer: '' })}
            >
              Add Question
            </Button>
            
            <Separator />

            <Button type="submit" className="w-full">Create Quiz</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function QuestionOptions({ control, questionIndex }: { control: any, questionIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const questionId = control.getValues(`questions.${questionIndex}.id`);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`questions.${questionIndex}.correctAnswer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Options & Correct Answer</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-2"
              >
                {fields.map((option, optionIndex) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <FormControl>
                       <RadioGroupItem value={control.getValues(`questions.${questionIndex}.options.${optionIndex}.value`)} id={`${questionId}-${optionIndex}`} />
                    </FormControl>
                    <FormField
                      control={control}
                      name={`questions.${questionIndex}.options.${optionIndex}.value`}
                      render={({ field: optionField }) => (
                        <FormItem className="flex-1">
                           <Label htmlFor={`${questionId}-${optionIndex}`} className="sr-only">Option</Label>
                           <Input placeholder={`Option ${optionIndex + 1}`} {...optionField} />
                        </FormItem>
                      )}
                    />
                    <Button type="button" size="icon" variant="ghost" onClick={() => remove(optionIndex)} disabled={fields.length <= 2}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => append({ value: '' })}
      >
        Add Option
      </Button>
    </div>
  );
}
