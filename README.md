# Swipe AI Interview

This is a Next.js application that provides an AI-powered interview experience. It allows candidates to go through an automated interview process, receive real-time feedback, and get a performance summary at the end.

## Project Overview

Swipe AI Interview is designed to streamline the initial screening process for technical roles. Candidates interact with an AI interviewer that asks a series of questions with varying difficulty. The AI provides feedback on answers and generates a final score and summary, which can be reviewed by a human interviewer on a separate dashboard.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN](https://ui.shadcn.com/)
- **Generative AI**: [Firebase Genkit](https.firebase.google.com/docs/genkit)
- **State Management**: React Context with `useReducer` (persisted to LocalStorage)

## Features

- **AI-Powered Interviews**: Candidates interact with an AI that asks questions and provides feedback.
- **Dynamic Question Generation**: The AI generates a unique set of questions for each interview.
- **Real-time Feedback**: After each answer, the candidate receives constructive feedback and suggestions for improvement.
- **Timed Questions**: Questions have time limits based on their difficulty (Easy, Medium, Hard).
- **Interviewer Dashboard**: A separate view for interviewers to see a list of completed interviews, scores, and AI-generated summaries.
- **Resume Parsing (Simulated)**: The user flow begins with uploading a resume to extract candidate details.
- **Light & Dark Mode**: The UI supports both light and dark themes.

## User Flow

1.  **Upload Resume**: The candidate starts by uploading their resume.
2.  **Information Collection**: The AI chat interface appears and asks for the candidate's name, email, and phone number.
3.  **Interview Guidelines**: The candidate is presented with the rules and structure of the interview.
4.  **Interview in Progress**: The AI asks a series of timed questions.
5.  **Feedback**: After each answer, the AI provides feedback.
6.  **Summary Generation**: Once all questions are answered, the AI generates a final score and a summary of the performance.
7.  **Interviewer Review**: An interviewer can log in to the dashboard to see the results of all completed interviews.

## Architecture

Here is a simplified ASCII diagram of the application's architecture:

```
+------------------+         +-------------------------+         +-----------------+
|                  |         |                         |         |                 |
|   React Client   |--(1)---->|      Next.js Server     |--(2)---->|   Genkit/AI     |
| (components)     |         |      (Server Actions)   |         |  (Google AI)    |
|                  |<--(5)----|                         |<--(3)----|                 |
+--------+---------+         +-------------------------+         +-----------------+
         |
         | (4)
         v
+------------------+
|                  |
|  State (Context) |
| & Local Storage  |
|                  |
+------------------+

1. User interaction triggers a server action (e.g., submitting an answer).
2. The server action calls a Genkit flow.
3. The Genkit flow interacts with the Google AI (Gemini) model to get feedback, a new question, or a summary.
4. The result is returned to the client.
5. The client-side state is updated, and the UI re-renders.
```
