'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summary of a candidate's interview performance.
 *
 * The flow takes the candidate's interview history as input and returns a summary of their strengths and weaknesses.
 *
 * @file Exports:
 *   - generateCandidateSummary: An async function that generates the candidate summary.
 *   - GenerateCandidateSummaryInput: The TypeScript type for the input to the generateCandidateSummary function.
 *   - GenerateCandidateSummaryOutput: The TypeScript type for the output of the generateCandidateSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateCandidateSummaryInputSchema = z.object({
  interviewHistory: z.string().describe('The complete chat history of the interview.'),
});
export type GenerateCandidateSummaryInput = z.infer<typeof GenerateCandidateSummaryInputSchema>;

// Define the output schema
const GenerateCandidateSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the candidate performance.'),
  score: z.number().describe('The final score of the candidate in the interview.'),
});
export type GenerateCandidateSummaryOutput = z.infer<typeof GenerateCandidateSummaryOutputSchema>;

// Define the prompt
const generateCandidateSummaryPrompt = ai.definePrompt({
  name: 'generateCandidateSummaryPrompt',
  input: {schema: GenerateCandidateSummaryInputSchema},
  output: {schema: GenerateCandidateSummaryOutputSchema},
  prompt: `You are an AI assistant reviewing a candidate's interview performance and will produce a final score and a summary of the candidate's performance.

  Analyze the following interview chat history:
  {{interviewHistory}}

  Provide a final score out of 100 and summarize the candidate's strengths and weaknesses based on their answers in the interview.
`,
});

// Define the flow
const generateCandidateSummaryFlow = ai.defineFlow(
  {
    name: 'generateCandidateSummaryFlow',
    inputSchema: GenerateCandidateSummaryInputSchema,
    outputSchema: GenerateCandidateSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateCandidateSummaryPrompt(input);
    return output!;
  }
);

/**
 * Generates a summary of the candidate's performance during the interview.
 * @param input The input object containing the interview history.
 * @returns A promise that resolves to the candidate's performance summary.
 */
export async function generateCandidateSummary(input: GenerateCandidateSummaryInput): Promise<GenerateCandidateSummaryOutput> {
  return generateCandidateSummaryFlow(input);
}
