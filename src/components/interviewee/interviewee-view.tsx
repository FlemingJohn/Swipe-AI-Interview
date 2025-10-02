"use client";
import { useInterviewStore } from '@/hooks/use-interview-store';
import { ResumeUploader } from './resume-uploader';
import { ChatView } from './chat-view';
import { Icons } from '../icons';
import { Button } from '../ui/button';

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
