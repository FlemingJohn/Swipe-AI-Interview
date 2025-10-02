"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { Candidate, InterviewQuestion, InterviewStatus, MissingInfo, ChatMessage } from '@/lib/types';
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import { generateCandidateSummary } from '@/ai/flows/generate-candidate-summary';
import { provideAnswerFeedback } from '@/ai/flows/provide-answer-feedback';

const LOCAL_STORAGE_KEY = 'ai-interview-ace-state';

interface AppState {
  candidates: Record<string, Candidate>;
  activeInterviewId: string | null;
  selectedCandidateId: string | null;
  isInitialized: boolean;
}

type Action =
  | { type: 'HYDRATE_STATE'; payload: AppState }
  | { type: 'START_NEW_INTERVIEW' }
  | { type: 'SET_ACTIVE_INTERVIEW'; payload: string | null }
  | { type: 'SET_SELECTED_CANDIDATE'; payload: string | null }
  | { type: 'UPDATE_CANDIDATE_INFO'; payload: { id: string; name?: string; email?: string; phone?: string } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: { id: string, message: ChatMessage } }
  | { type: 'SET_QUESTIONS'; payload: { id: string, questions: InterviewQuestion[] } }
  | { type: 'NEXT_QUESTION'; payload: { id: string } }
  | { type: 'UPDATE_INTERVIEW_STATUS'; payload: { id: string, status: InterviewStatus, missingInfo?: MissingInfo } }
  | { type: 'SET_SUMMARY_AND_SCORE'; payload: { id: string; summary: string; score: number } }
  | { type: 'RESET_INTERVIEW'; payload: { id: string } }
  | { type: 'RESUME_INTERVIEW'; payload: { id: string } }
  | { type: 'DISMISS_RESUME_PROMPT'; payload: { id: string } };

const initialState: AppState = {
  candidates: {},
  activeInterviewId: null,
  selectedCandidateId: null,
  isInitialized: false,
};

const interviewReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'HYDRATE_STATE':
      return { ...action.payload, isInitialized: true };

    case 'START_NEW_INTERVIEW': {
      const newId = `candidate-${Date.now()}`;
      const newCandidate: Candidate = {
        id: newId,
        name: '',
        email: '',
        phone: '',
        score: null,
        summary: null,
        createdAt: Date.now(),
        interview: {
          status: 'awaiting_resume',
          questions: [],
          chatHistory: [],
          currentQuestionIndex: -1,
          questionStartTime: null,
          missingInfo: 'name',
        },
      };
      return {
        ...state,
        candidates: { ...state.candidates, [newId]: newCandidate },
        activeInterviewId: newId,
      };
    }

    case 'SET_ACTIVE_INTERVIEW':
      return { ...state, activeInterviewId: action.payload };

    case 'SET_SELECTED_CANDIDATE':
      return { ...state, selectedCandidateId: action.payload };

    case 'UPDATE_CANDIDATE_INFO': {
      const { id, ...updates } = action.payload;
      const candidate = state.candidates[id];
      if (!candidate) return state;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [id]: { ...candidate, ...updates },
        },
      };
    }
    
    case 'ADD_CHAT_MESSAGE': {
        const { id, message } = action.payload;
        const candidate = state.candidates[id];
        if (!candidate) return state;
        const newChatHistory = [...candidate.interview.chatHistory, message];
        return {
            ...state,
            candidates: {
                ...state.candidates,
                [id]: {
                    ...candidate,
                    interview: { ...candidate.interview, chatHistory: newChatHistory },
                },
            },
        };
    }

    case 'SET_QUESTIONS': {
      const { id, questions } = action.payload;
      const candidate = state.candidates[id];
      if (!candidate) return state;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [id]: {
            ...candidate,
            interview: {
              ...candidate.interview,
              questions,
              status: 'in_progress',
              currentQuestionIndex: 0,
              questionStartTime: Date.now(),
            },
          },
        },
      };
    }

    case 'NEXT_QUESTION': {
      const { id } = action.payload;
      const candidate = state.candidates[id];
      if (!candidate) return state;
      const nextIndex = candidate.interview.currentQuestionIndex + 1;
      const isFinished = nextIndex >= candidate.interview.questions.length;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          [id]: {
            ...candidate,
            interview: {
              ...candidate.interview,
              currentQuestionIndex: isFinished ? -1 : nextIndex,
              status: isFinished ? 'generating_summary' : 'in_progress',
              questionStartTime: isFinished ? null : Date.now(),
            },
          },
        },
      };
    }

    case 'UPDATE_INTERVIEW_STATUS': {
        const { id, status, missingInfo } = action.payload;
        const candidate = state.candidates[id];
        if (!candidate) return state;
        
        let newChatHistory = candidate.interview.chatHistory;
        if (status === 'collecting_info' && candidate.interview.chatHistory.length === 0) {
            const systemMessage: ChatMessage = {
                id: `msg-intro-${Date.now()}`,
                role: 'assistant',
                content: `Hello! I am an AI interviewer from Swipe. Before we begin, I need to confirm a few details. What is your full name?`
            };
            newChatHistory = [systemMessage];
        }

        return {
            ...state,
            candidates: {
                ...state.candidates,
                [id]: {
                    ...candidate,
                    interview: { 
                        ...candidate.interview, 
                        status,
                        chatHistory: newChatHistory,
                        ...(missingInfo !== undefined && { missingInfo }),
                    },
                },
            },
        };
    }

    case 'SET_SUMMARY_AND_SCORE': {
        const { id, summary, score } = action.payload;
        const candidate = state.candidates[id];
        if (!candidate) return state;
        return {
            ...state,
            candidates: {
                ...state.candidates,
                [id]: {
                    ...candidate,
                    summary,
                    score,
                    interview: { ...candidate.interview, status: 'summary_ready' },
                },
            },
        };
    }

    case 'RESET_INTERVIEW': {
      const { id } = action.payload;
      const candidate = state.candidates[id];
      if (!candidate) return state;
      const newCandidate: Candidate = {
        ...candidate,
        score: null,
        summary: null,
        interview: {
          status: 'awaiting_resume',
          questions: [],
          chatHistory: [],
          currentQuestionIndex: -1,
          questionStartTime: null,
          missingInfo: 'name',
        }
      }
      return {
        ...state,
        activeInterviewId: id,
        candidates: { ...state.candidates, [id]: newCandidate },
      };
    }
    
    case 'RESUME_INTERVIEW':
        return { ...state, activeInterviewId: action.payload.id };

    case 'DISMISS_RESUME_PROMPT': {
        return { ...state, activeInterviewId: null };
    }

    default:
      return state;
  }
};

const InterviewContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action>, actions: any } | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        dispatch({ type: 'HYDRATE_STATE', payload: JSON.parse(storedState) });
      } else {
        dispatch({ type: 'HYDRATE_STATE', payload: initialState });
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
      dispatch({ type: 'HYDRATE_STATE', payload: initialState });
    }
  }, []);

  useEffect(() => {
    if (state.isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const actions = {
    fetchAndSetQuestions: async (id: string) => {
      dispatch({ type: 'UPDATE_INTERVIEW_STATUS', payload: { id, status: 'generating_questions' } });
      try {
        const questions = await generateInterviewQuestions({
            role: "Full Stack (React/Node)",
            numEasy: 2,
            numMedium: 2,
            numHard: 2,
            skillToTest: "General full-stack knowledge"
        });
        dispatch({ type: 'SET_QUESTIONS', payload: { id, questions } });
      } catch (error) {
        console.error("Failed to generate questions", error);
        dispatch({ type: 'UPDATE_INTERVIEW_STATUS', payload: { id, status: 'ready_to_start' } });
      }
    },
    fetchAndSetSummary: async (id: string) => {
        const candidate = state.candidates[id];
        if (!candidate) return;
        const interviewHistory = candidate.interview.chatHistory
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        
        try {
            const { summary, score } = await generateCandidateSummary({ interviewHistory });
            dispatch({ type: 'SET_SUMMARY_AND_SCORE', payload: { id, summary, score } });
        } catch (error) {
            console.error("Failed to generate summary", error);
            dispatch({ type: 'UPDATE_INTERVIEW_STATUS', payload: { id, status: 'completed' } });
        }
    },
    fetchAnswerFeedback: async (question: string, answer: string) => {
        try {
            const feedback = await provideAnswerFeedback({ question, answer });
            return feedback;
        } catch (error) {
            console.error("Failed to generate feedback", error);
            return null;
        }
    }
  };

  return (
    <InterviewContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviewStore = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviewStore must be used within an InterviewProvider');
  }
  return context;
};
