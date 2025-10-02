import { config } from 'dotenv';
config();

import '@/ai/flows/generate-candidate-summary.ts';
import '@/ai/flows/assess-technical-skills.ts';
import '@/ai/flows/generate-interview-questions.ts';
import '@/ai/flows/provide-answer-feedback.ts';
