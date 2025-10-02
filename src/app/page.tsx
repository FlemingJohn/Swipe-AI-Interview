"use client";

import { AppContent } from "@/components/app-content";
import { InterviewProvider } from "@/hooks/use-interview-store";

export default function Home() {
  return (
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  );
}
