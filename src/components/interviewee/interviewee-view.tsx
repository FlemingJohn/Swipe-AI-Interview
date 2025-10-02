
"use client";
import { useInterviewStore } from '@/hooks/use-interview-store';
import { ResumeUploader } from './resume-uploader';
import { ChatView } from './chat-view';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

export function IntervieweeView() {
  const { state, dispatch, actions } = useInterviewStore();

  if (!state.isInitialized) {
    return <div className="flex justify-center items-center h-96"><Icons.spinner className="w-8 h-8 animate-spin"/></div>;
  }
  
  const activeCandidate = state.activeInterviewId ? state.candidates[state.activeInterviewId] : null;

  if (!activeCandidate) {
    return <ResumeUploader onUpload={() => dispatch({ type: 'START_NEW_INTERVIEW' })} />;
  }
  
  const { status } = activeCandidate.interview;

  switch (status) {
    case 'awaiting_resume':
      return <ResumeUploader onUpload={() => dispatch({ type: 'UPDATE_INTERVIEW_STATUS', payload: { id: activeCandidate.id, status: 'collecting_info', missingInfo: 'name' } })} />;
    
    case 'collecting_info':
    case 'generating_questions':
    case 'in_progress':
    case 'generating_summary':
    case 'summary_ready':
    case 'completed':
        return <ChatView candidate={activeCandidate} />;

    case 'awaiting_guidelines':
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-6 text-center p-4">
            <Icons.brain className="w-16 h-16 text-primary" />
            <h2 className="text-2xl font-bold">Interview Guidelines</h2>
            <p className="text-muted-foreground max-w-lg">
                Welcome, {activeCandidate.name}! Please read the following guidelines carefully before you begin.
            </p>
            <ul className="text-left space-y-2 max-w-md bg-muted p-4 rounded-lg">
                <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span>The interview consists of 6 questions covering various full-stack topics.</span>
                </li>
                <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span>You will have a time limit for each question: 20 seconds for easy, 60 for medium, and 120 for hard.</span>
                </li>
                <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span>Once you submit an answer, you cannot go back. If the timer runs out, your current answer will be submitted.</span>
                </li>
                <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span>Take a deep breath and do your best. Good luck!</span>
                </li>
            </ul>
            <Button size="lg" onClick={() => actions.fetchAndSetQuestions(activeCandidate.id)}>
                I'm Ready, Start the Interview
            </Button>
        </div>
      );

    case 'ready_to_start':
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
                <Icons.brain className="w-16 h-16 text-primary" />
                <h2 className="text-2xl font-bold">You're all set, {activeCandidate.name}!</h2>
                <p className="text-muted-foreground max-w-md">
                    The interview will consist of 6 questions with time limits.
                    Good luck!
                </p>
                <Button size="lg" onClick={() => actions.fetchAndSetQuestions(activeCandidate.id)}>
                    Start Interview
                </Button>
            </div>
        );

    case 'finished':
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <h2 className="text-2xl font-bold">Interview Finished</h2>
          <p className="text-muted-foreground">You can view your results in the Interviewer tab.</p>
          <Button onClick={() => dispatch({ type: 'SET_ACTIVE_INTERVIEW', payload: null })}>Start New Interview</Button>
        </div>
      );
      
    default:
      return <div className="flex justify-center items-center h-96"><p>An unknown error occurred.</p></div>;
  }
}

    