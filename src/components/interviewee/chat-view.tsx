"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/hooks/use-interview-store';
import type { Candidate, ChatMessage, MissingInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Timer } from './timer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { InterviewLoadingAnimation } from './interview-loading-animation';

interface ChatViewProps {
  candidate: Candidate;
}

const getQuestionTime = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  if (difficulty === 'Easy') return 20;
  if (difficulty === 'Medium') return 60;
  if (difficulty === 'Hard') return 120;
  return 60;
};

export function ChatView({ candidate }: ChatViewProps) {
  const { dispatch, actions } = useInterviewStore();
  const [inputValue, setInputValue] = useState('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { status, chatHistory, missingInfo, currentQuestionIndex, questions, questionStartTime } = candidate.interview;
  const currentQuestion = currentQuestionIndex !== -1 ? questions[currentQuestionIndex] : null;
  const questionTimeLimit = currentQuestion ? getQuestionTime(currentQuestion.difficulty) : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (status === 'in_progress' && currentQuestion) {
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (lastMessage?.role !== 'assistant' || !lastMessage.content.includes(currentQuestion.question)) {
             const questionMessage: ChatMessage = {
                id: `msg-q-${currentQuestionIndex}-${Date.now()}`,
                role: 'assistant',
                content: `Question ${currentQuestionIndex + 1}/${questions.length} (${currentQuestion.difficulty}):\n\n${currentQuestion.question}`
             };
             dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { id: candidate.id, message: questionMessage } });
        }
    }
  }, [status, currentQuestion, currentQuestionIndex, questions.length, dispatch, candidate.id, chatHistory]);
  
  useEffect(() => {
    if (status === 'generating_summary' && candidate.summary === null) {
        actions.fetchAndSetSummary(candidate.id);
    }
  }, [status, candidate.id, candidate.summary, actions]);


  const handleSendMessage = async (content: string) => {
    if ((!content.trim() && status !== 'collecting_info') || isGettingFeedback) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      ...(currentQuestion && { questionNumber: currentQuestionIndex })
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { id: candidate.id, message: userMessage } });
    setInputValue('');

    if (status === 'collecting_info') {
        handleInfoCollection(content.trim());
    } else if (status === 'in_progress' && currentQuestion) {
        setIsGettingFeedback(true);
        const feedback = await actions.fetchAnswerFeedback(currentQuestion.question, content.trim());
        if (feedback) {
             const feedbackMessage: ChatMessage = {
                id: `msg-feedback-${Date.now()}`,
                role: 'assistant',
                content: `**Feedback:** ${feedback.feedback}\n\n**Suggestion:** ${feedback.suggestion}`
            };
            dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { id: candidate.id, message: feedbackMessage } });
        }
        setIsGettingFeedback(false);
        dispatch({ type: 'NEXT_QUESTION', payload: { id: candidate.id } });
    }
  };

  const handleInfoCollection = (value: string) => {
    let nextMissingInfo: MissingInfo = null;
    let nextPrompt = '';

    if (missingInfo === 'name') {
      dispatch({ type: 'UPDATE_CANDIDATE_INFO', payload: { id: candidate.id, name: value } });
      nextMissingInfo = 'email';
      nextPrompt = 'Thank you. What is your email address?';
    } else if (missingInfo === 'email') {
      dispatch({ type: 'UPDATE_CANDIDATE_INFO', payload: { id: candidate.id, email: value } });
      nextMissingInfo = 'phone';
      nextPrompt = 'Great. And finally, what is your phone number?';
    } else if (missingInfo === 'phone') {
      dispatch({ type: 'UPDATE_CANDIDATE_INFO', payload: { id: candidate.id, phone: value } });
      nextMissingInfo = null;
      nextPrompt = "Perfect! All your details are saved. We're ready to begin the interview.";
      dispatch({ type: 'UPDATE_INTERVIEW_STATUS', payload: { id: candidate.id, status: 'ready_to_start', missingInfo: null } });
    }

    if(nextPrompt) {
        const assistantMessage: ChatMessage = {
            id: `msg-info-${Date.now()}`,
            role: 'assistant',
            content: nextPrompt
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { id: candidate.id, message: assistantMessage } });
    }
    
    if (nextMissingInfo) {
        dispatch({ type: 'UPDATE_INTERVIEW_STATUS', payload: { id: candidate.id, status: 'collecting_info', missingInfo: nextMissingInfo } });
    }
  };

  const handleTimeUp = () => {
    if (status === 'in_progress') {
      handleSendMessage(inputValue || "(No answer provided)");
    }
  };
  
  const isChatDisabled = status !== 'collecting_info' && status !== 'in_progress' || isGettingFeedback;

  return (
    <div className="flex flex-col h-[70vh] max-h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''} animate-in fade-in-0 slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
            {message.role !== 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground"><Icons.brain className="w-5 h-5" /></AvatarFallback>
              </Avatar>
            )}
            <div className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
            </div>
             {message.role === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>{candidate.name ? candidate.name.charAt(0).toUpperCase() : 'C'}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isGettingFeedback && (
          <div className="flex justify-start items-center gap-2 text-muted-foreground">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground"><Icons.brain className="w-5 h-5" /></AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Icons.spinner className="w-5 h-5 animate-spin" />
              <p>Thinking about your feedback...</p>
            </div>
          </div>
        )}

        {status === 'generating_questions' && (
           <InterviewLoadingAnimation />
        )}

        {status === 'generating_summary' && (
            <div className="flex flex-col justify-center items-center gap-4 text-muted-foreground text-center">
                <Icons.spinner className="w-8 h-8 animate-spin" />
                <p className='font-semibold text-lg'>Hold on, we're almost there!</p>
                <p className='text-sm'>Analyzing your answers and generating a final summary...</p>
            </div>
        )}

        {status === 'summary_ready' && candidate.summary && candidate.score && (
            <Card className="bg-secondary">
                <CardHeader>
                    <CardTitle>Interview Complete!</CardTitle>
                    <CardDescription>Here is your performance summary.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Final Score</h3>
                        <p className="text-2xl font-bold text-primary">{candidate.score}/100</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">AI Summary</h3>
                        <p className="text-sm text-muted-foreground">{candidate.summary}</p>
                    </div>
                     <Button onClick={() => dispatch({ type: 'SET_ACTIVE_INTERVIEW', payload: null })}>
                        Finish & Start New
                     </Button>
                </CardContent>
            </Card>
        )}

        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder={isChatDisabled ? "Interview is not in progress" : "Type your answer here..."}
            className="pr-24"
            rows={2}
            disabled={isChatDisabled}
          />
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
            {questionStartTime && questionTimeLimit && status === 'in_progress' && (
                <Timer
                    key={currentQuestionIndex}
                    startTime={questionStartTime}
                    duration={questionTimeLimit}
                    onTimeUp={handleTimeUp}
                />
            )}
            <Button size="icon" onClick={() => handleSendMessage(inputValue)} disabled={isChatDisabled}>
              {isGettingFeedback ? <Icons.spinner className='animate-spin' /> : <Icons.send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
