# **App Name**: AI Interview Ace

## Core Features:

- Resume Upload & Parsing: Allows candidates to upload resumes (PDF/DOCX) and extracts key information (Name, Email, Phone).
- Contact Info Validation: Chatbot prompts candidates for missing contact information before the interview starts.
- Dynamic Question Generation: AI dynamically generates interview questions (2 Easy, 2 Medium, 2 Hard) tailored for a Full Stack (React/Node) role.  The LLM will use a tool to help it reason about how important it is to test certain specific technical skills.
- Timed Interview: Presents questions one at a time with timers (Easy: 20s, Medium: 60s, Hard: 120s).  Automatically submits answers when time expires.
- AI Scoring & Summary: After the interview, AI calculates a final score and creates a summary of the candidate's performance.
- Interviewer Dashboard: Displays a sortable list of candidates with scores and summaries, and allows for detailed view of each candidate's interview history.
- Persistence and Restore: Saves all timers, answers, and progress locally. Restores state on reopening with a 'Welcome Back' modal.

## Style Guidelines:

- Primary color: Strong blue (#2979FF) to represent confidence and clarity.
- Background color: Light blue (#E3F2FD), offering a calming backdrop.
- Accent color: Purple (#9575CD), providing highlights and calling attention to key interactive elements.
- Body and headline font: 'Inter' (sans-serif) provides a modern, neutral look suitable for both headlines and body text.
- Code font: 'Source Code Pro' (monospace) for displaying code snippets.
- Use clear, professional icons to represent actions and information, maintaining a consistent style throughout the application.
- Employ subtle transitions and animations to enhance the user experience without being distracting.  Use animations to communicate progress, success, and loading states.