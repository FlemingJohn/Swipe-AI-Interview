"use client";

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
  startTime: number;
  duration: number; // in seconds
  onTimeUp: () => void;
}

export function Timer({ startTime, duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, Math.round(duration - elapsed));
      setTimeLeft(remaining);

      if (remaining === 0) {
        onTimeUp();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onTimeUp]);

  const progress = (timeLeft / duration) * 100;
  
  const getTimerColor = () => {
    if (progress < 25) return "bg-destructive";
    if (progress < 50) return "bg-yellow-500";
    return "bg-primary";
  }

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
        <div 
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${getTimerColor()} text-primary-foreground`}
        >
          {timeLeft}
        </div>
    </div>
  );
}
