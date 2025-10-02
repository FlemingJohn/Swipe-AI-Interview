"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeBackModalProps {
  isOpen: boolean;
  onResume: () => void;
  onStartNew: () => void;
  candidateName?: string;
}

export function WelcomeBackModal({ isOpen, onResume, onStartNew, candidateName }: WelcomeBackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onStartNew()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
          <DialogDescription>
            {candidateName ? `You have an interview in progress for ${candidateName}.` : 'You have an interview in progress.'}
            {' '}
            Would you like to resume or start a new one?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onStartNew}>
            Start New
          </Button>
          <Button onClick={onResume}>Resume Interview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
