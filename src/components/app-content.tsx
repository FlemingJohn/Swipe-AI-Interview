
"use client";

import { useEffect, useState } from 'react';
import { useInterviewStore } from '@/hooks/use-interview-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { IntervieweeView } from '@/components/interviewee/interviewee-view';
import { InterviewerDashboard } from '@/components/interviewer/interviewer-dashboard';
import { WelcomeBackModal } from '@/components/welcome-back-modal';
import { ModeToggle } from './mode-toggle';

export function AppContent() {
  const { state, dispatch } = useInterviewStore();
  const [activeTab, setActiveTab] = useState('interviewee');
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  
  const unfinishedInterview = Object.values(state.candidates).find(
    c => c.interview.status !== 'awaiting_resume' && c.interview.status !== 'finished' && c.interview.status !== 'summary_ready'
  );

  useEffect(() => {
    if (state.isInitialized && unfinishedInterview && state.activeInterviewId === null) {
      setShowWelcomeBack(true);
    }
  }, [state.isInitialized, unfinishedInterview, state.activeInterviewId]);

  const handleResume = () => {
    if (unfinishedInterview) {
      dispatch({ type: 'RESUME_INTERVIEW', payload: { id: unfinishedInterview.id } });
    }
    setShowWelcomeBack(false);
    setActiveTab('interviewee');
  };

  const handleStartNew = () => {
    if (unfinishedInterview) {
       dispatch({ type: 'RESET_INTERVIEW', payload: { id: unfinishedInterview.id } });
    }
    setShowWelcomeBack(false);
    setActiveTab('interviewee');
  };

  if (!state.isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="relative flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold tracking-tight font-headline">
                Swipe AI Interview
            </h1>
        </div>
        <div className="absolute right-0">
            <ModeToggle />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interviewee">Interviewee</TabsTrigger>
          <TabsTrigger value="interviewer">Interviewer</TabsTrigger>
        </TabsList>
        <TabsContent value="interviewee">
          <Card>
            <CardContent className="p-2 md:p-6">
              <IntervieweeView />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="interviewer">
          <Card>
            <CardContent className="p-2 md:p-6">
              <InterviewerDashboard onSelectCandidate={() => setActiveTab('interviewer')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {unfinishedInterview && (
        <WelcomeBackModal
          isOpen={showWelcomeBack}
          onResume={handleResume}
          onStartNew={handleStartNew}
          candidateName={unfinishedInterview.name}
        />
      )}
    </main>
  );
}
