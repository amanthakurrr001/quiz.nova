'use server';

/**
 * @fileOverview Summarizes quiz results to provide insights into user performance.
 *
 * - summarizeQuizResults - A function that summarizes quiz results.
 * - SummarizeQuizResultsInput - The input type for the summarizeQuizResults function.
 * - SummarizeQuizResultsOutput - The return type for the summarizeQuizResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeQuizResultsInputSchema = z.object({
  quizTopic: z.string().describe('The topic of the quiz.'),
  userAnswers: z.array(z.string()).describe('An array of the user\'s answers to the quiz questions.'),
  correctAnswers: z
    .array(z.string())
    .describe('An array of the correct answers to the quiz questions.'),
});
export type SummarizeQuizResultsInput = z.infer<typeof SummarizeQuizResultsInputSchema>;

const SummarizeQuizResultsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s performance on the quiz.'),
  score: z.number().describe('The user\'s score on the quiz as a percentage.'),
  progress: z.string().describe('A short summary of the generated output.'),
});
export type SummarizeQuizResultsOutput = z.infer<typeof SummarizeQuizResultsOutputSchema>;

export async function summarizeQuizResults(
  input: SummarizeQuizResultsInput
): Promise<SummarizeQuizResultsOutput> {
  return summarizeQuizResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeQuizResultsPrompt',
  input: {schema: SummarizeQuizResultsInputSchema},
  output: {schema: SummarizeQuizResultsOutputSchema},
  prompt: `You are an AI quiz summarizer. You will take the quiz topic, the user's answers, and the correct answers to generate a quiz summary, the score achieved by the user, and progress.

Quiz Topic: {{quizTopic}}
User Answers: {{userAnswers}}
Correct Answers: {{correctAnswers}}

Summary:
Score:
Progress: `,
});

const summarizeQuizResultsFlow = ai.defineFlow(
  {
    name: 'summarizeQuizResultsFlow',
    inputSchema: SummarizeQuizResultsInputSchema,
    outputSchema: SummarizeQuizResultsOutputSchema,
  },
  async input => {
    const {userAnswers, correctAnswers} = input;
    const score = (userAnswers.filter((answer, index) => answer === correctAnswers[index]).length / userAnswers.length) * 100;
    const {output} = await prompt({...input, score});
    return {...output!, score, progress: 'Generated a summary of the quiz results, including the score.'};
  }
);
