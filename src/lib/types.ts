
export type InterviewQuestion = {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  questionNumber?: number;
};

export type InterviewStatus = 
  | 'awaiting_resume'
  | 'collecting_info'
  | 'awaiting_guidelines'
  | 'ready_to_start'
  | 'generating_questions'
  | 'in_progress'
  | 'completed'
  | 'generating_summary'
  | 'summary_ready'
  | 'finished';

export type MissingInfo = 'name' | 'email' | 'phone' | null;

export type InterviewSession = {
  status: InterviewStatus;
  questions: InterviewQuestion[];
  chatHistory: ChatMessage[];
  currentQuestionIndex: number;
  questionStartTime: number | null;
  missingInfo: MissingInfo;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  score: number | null;
  summary: string | null;
  interview: InterviewSession;
  createdAt: number;
};

    