"use client";

import { useState } from 'react';
import { useInterviewStore } from '@/hooks/use-interview-store';
import { CandidatesTable } from './candidates-table';
import { CandidateDetails } from './candidate-details';
import type { Candidate } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Icons } from '../icons';

interface InterviewerDashboardProps {
  onSelectCandidate: (candidateId: string) => void;
}

export function InterviewerDashboard({ onSelectCandidate }: InterviewerDashboardProps) {
  const { state, dispatch } = useInterviewStore();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const candidates = Object.values(state.candidates)
    .filter(c => c.interview.status === 'summary_ready' || c.interview.status === 'finished')
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    dispatch({ type: 'SET_SELECTED_CANDIDATE', payload: candidate.id });
  };
  
  if (candidates.length === 0) {
    return (
        <div className="text-center h-96 flex flex-col justify-center items-center">
            <Icons.search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Completed Interviews</h3>
            <p className="text-muted-foreground">
                As candidates complete their interviews, they will appear here.
            </p>
        </div>
    );
  }

  return (
    <div>
        <CardHeader className='px-0'>
            <CardTitle>Candidate Dashboard</CardTitle>
            <CardDescription>Review completed interviews and AI-generated summaries.</CardDescription>
        </CardHeader>
        <CandidatesTable candidates={candidates} onRowClick={handleRowClick} />
        {selectedCandidate && (
            <CandidateDetails 
                candidate={selectedCandidate}
                isOpen={!!selectedCandidate}
                onOpenChange={() => setSelectedCandidate(null)}
            />
        )}
    </div>
  );
}
