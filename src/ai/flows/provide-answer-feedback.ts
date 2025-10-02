'use server';

/**
 * @fileOverview A flow for providing feedback on an interview answer.
 *
 * - provideAnswerFeedback - A function that provides feedback on an answer.
 * - ProvideAnswerFeedbackInput - The input type for the provideAnswerFeedback function.
 * - ProvideAnswerFeedbackOutput - The return type for the provideAnswerfeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAnswerFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question that was asked.'),
  answer: z.string().describe("The candidate's answer to the question."),
});
export type ProvideAnswerFeedbackInput = z.infer<typeof ProvideAnswerFeedbackInputSchema>;


const ProvideAnswerFeedbackOutputSchema = z.object({
    feedback: z.string().describe("Constructive feedback on the candidate's answer."),
    suggestion: z.string().describe("A suggestion for how the candidate could improve their answer."),
});
export type ProvideAnswerFeedbackOutput = z.infer<typeof ProvideAnswerFeedbackOutputSchema>;


export async function provideAnswerFeedback(input: ProvideAnswerFeedbackInput): Promise<ProvideAnswerFeedbackOutput> {
  return provideAnswerFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAnswerFeedbackPrompt',
  input: {schema: ProvideAnswerFeedbackInputSchema},
  output: {schema: ProvideAnswerFeedbackOutputSchema},
  system: `You are an expert career coach providing feedback on interview answers.

  You will receive a question and a candidate's answer. Your task is to provide constructive feedback and a suggestion for improvement.

  The feedback should be encouraging and focus on specific areas for improvement.
  The suggestion should offer a concrete example of how the answer could be better.
  
  Keep your feedback and suggestions concise and to the point.`,
  prompt: `Question: {{{question}}}
Answer: {{{answer}}}`,
});

const provideAnswerFeedbackFlow = ai.defineFlow(
  {
    name: 'provideAnswerFeedbackFlow',
    inputSchema: ProvideAnswerFeedbackInputSchema,
    outputSchema: ProvideAnswerFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
