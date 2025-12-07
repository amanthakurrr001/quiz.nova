'use server';

/**
 * @fileOverview Generates a quiz from a given topic, number of questions, and difficulty level.
 *
 * - generateQuizFromTopic - A function that generates a quiz based on the provided topic, number of questions, and difficulty level.
 * - GenerateQuizInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z.number().int().positive().describe('The number of questions in the quiz.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuizFromTopic(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFromTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTopicPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz on the topic of {{topic}} with {{numQuestions}} questions and a difficulty level of {{difficulty}}. Return the quiz as a JSON object.  Each question should have the question text, possible answers, and the correct answer. Make sure the answer is one of the possible answers provided. The JSON object should be flat and have no nested JSON objects or arrays. Example: {\"question1\": \"What is the capital of France?\", \"answer1_1\": \"London\", \"answer1_2\": \"Paris\", \"answer1_3\": \"Berlin\", \"correct_answer1\": \"Paris\", \"question2\": \"What is 2 + 2?\", \"answer2_1\": \"3\", \"answer2_2\": \"4\", \"answer2_3\": \"5\", \"correct_answer2\": \"4\" }.
`,
});

const generateQuizFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
