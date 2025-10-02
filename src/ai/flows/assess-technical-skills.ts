'use server';

/**
 * @fileOverview An AI agent for assessing the importance of technical skills.
 *
 * - assessTechnicalSkillsImportance - A function that assesses the importance of technical skills.
 * - AssessTechnicalSkillsImportanceInput - The input type for the assessTechnicalSkillsImportance function.
 * - AssessTechnicalSkillsImportanceOutput - The return type for the assessTechnicalSkillsImportance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessTechnicalSkillsImportanceInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job for which the candidate is being interviewed.'),
  technicalSkills: z.array(z.string()).describe('A list of technical skills to assess.'),
});
export type AssessTechnicalSkillsImportanceInput = z.infer<typeof AssessTechnicalSkillsImportanceInputSchema>;

const AssessTechnicalSkillsImportanceOutputSchema = z.record(z.string(), z.number().min(0).max(1)).describe('A map of technical skills to their importance (between 0 and 1).');
export type AssessTechnicalSkillsImportanceOutput = z.infer<typeof AssessTechnicalSkillsImportanceOutputSchema>;

export async function assessTechnicalSkillsImportance(input: AssessTechnicalSkillsImportanceInput): Promise<AssessTechnicalSkillsImportanceOutput> {
  return assessTechnicalSkillsImportanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessTechnicalSkillsImportancePrompt',
  input: {schema: AssessTechnicalSkillsImportanceInputSchema},
  output: {schema: AssessTechnicalSkillsImportanceOutputSchema},
  prompt: `You are an expert at understanding job descriptions and determining which technical skills are most important for a candidate to possess.

Given the following job description:

{{jobDescription}}

And the following list of technical skills:

{{#each technicalSkills}}- {{this}}\n{{/each}}

Please respond with a JSON object that maps each technical skill to a number between 0 and 1 representing how important that skill is for the job. 0 means not important at all, and 1 means extremely important.

For example:

{
  "React": 0.9,
  "Node.js": 0.8,
  "Typescript": 0.7,
  "SQL": 0.6,
  "MongoDB": 0.4,
  "GraphQL": 0.3
}

Ensure the response is valid JSON.

`, config: {
    temperature: 0.0,
    topP: 1,
    topK: 32,
  }
});

const assessTechnicalSkillsImportanceFlow = ai.defineFlow(
  {
    name: 'assessTechnicalSkillsImportanceFlow',
    inputSchema: AssessTechnicalSkillsImportanceInputSchema,
    outputSchema: AssessTechnicalSkillsImportanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
