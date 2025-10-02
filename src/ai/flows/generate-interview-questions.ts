'use server';

/**
 * @fileOverview A flow for generating interview questions for a full-stack role with varying difficulty levels.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionDifficultySchema = z.enum(['Easy', 'Medium', 'Hard']);

const GenerateInterviewQuestionsInputSchema = z.object({
  role: z.string().describe('The role to generate interview questions for.'),
  numEasy: z.number().describe('The number of easy questions to generate.'),
  numMedium: z.number().describe('The number of medium questions to generate.'),
  numHard: z.number().describe('The number of hard questions to generate.'),
  skillToTest: z.string().describe('The specific skill the AI should focus on testing.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const InterviewQuestionSchema = z.object({
  question: z.string().describe('The interview question.'),
  difficulty: QuestionDifficultySchema.describe('The difficulty level of the question.'),
});

const GenerateInterviewQuestionsOutputSchema = z.array(InterviewQuestionSchema);
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;


export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const importanceAssessmentTool = ai.defineTool({
  name: 'assessSkillImportance',
  description: 'Determines how important a given technical skill is for a particular role on a scale of 1-10. A higher number indicates that the skill is more critical for the role.',
  inputSchema: z.object({
    skill: z.string().describe('The technical skill to assess (e.g., React, Node.js, database design).'),
    role: z.string().describe('The name of the job role.'),
  }),
  outputSchema: z.number().describe('The importance score of the skill (1-10).'),
}, async (input) => {
  // Placeholder implementation: replace with actual logic to determine skill importance.
  // In a real application, this could involve consulting a database of job descriptions,
  // analyzing industry trends, or using a more sophisticated AI model.
  console.log(`Tool was called to assess importance of ${input.skill} for ${input.role}`)
  return 7; // Assuming the skill is moderately important for now
});


const generateInterviewQuestionsPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  tools: [importanceAssessmentTool],
  system: `You are an expert in creating interview questions for various software engineering roles.

  You will generate a list of interview questions based on the provided role, number of questions per difficulty, and a specific skill to test. Use the provided tool to determine how important the given skill is when generating the questions.
  The output should be a JSON array of interview questions, each with a question and difficulty field (Easy, Medium, Hard).
  Make sure that the specific skill to test is assessed by all of the questions.
  If the questions are about a technical skill, use the assessSkillImportance tool to determine how much focus to give the questions.
  Use a variety of question styles - some should be multiple choice, some should require short answers, some should require code snippets, and some should be open-ended.
  Here is an example of what a single question looks like:
  {
    "question": "Explain the difference between state and props in React.",
    "difficulty": "Easy"
  }
  Make sure you return valid JSON that matches this format.`,  
  prompt: `Generate interview questions for the following role:
Role: {{{role}}}
Number of easy questions: {{{numEasy}}}
Number of medium questions: {{{numMedium}}}
Number of hard questions: {{{numHard}}}
Specific skill to test: {{{skillToTest}}}`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateInterviewQuestionsPrompt(input);
    return output!;
  }
);
