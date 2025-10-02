"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Candidate, ChatMessage } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CandidateDetailsProps {
  candidate: Candidate;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateDetails({ candidate, isOpen, onOpenChange }: CandidateDetailsProps) {
  const getAnswerForQuestion = (index: number): ChatMessage | undefined => {
    return candidate.interview.chatHistory.find(
      (msg) => msg.role === 'user' && msg.questionNumber === index
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{candidate.name}</DialogTitle>
          <DialogDescription>
            {candidate.email} &middot; {candidate.phone}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 pr-8 space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">AI Performance Summary</h3>
              <div className="flex items-center gap-4">
                <p className="font-bold text-2xl">Score:</p>
                <Badge className="text-2xl px-4 py-1">{candidate.score}/100</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.summary}</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Interview Transcript</h3>
              {candidate.interview.questions.map((q, index) => {
                const answer = getAnswerForQuestion(index);
                return (
                  <div key={index} className="space-y-2">
                    <p className="font-semibold">
                      Q{index + 1} ({q.difficulty}): {q.question}
                    </p>
                    <div className="p-3 rounded-md bg-muted text-sm text-muted-foreground italic">
                      {answer ? answer.content : 'No answer recorded.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
