import { LucideProps, User, Bot, BrainCircuit, Upload, Send, Search, ChevronsUpDown, Loader2 } from 'lucide-react';

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
      <path d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
      <path d="M12 12v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" />
      <path d="M8 17a2 2 0 0 0 2 2h2" />
      <path d="M8 12H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
    </svg>
  ),
  user: User,
  bot: Bot,
  brain: BrainCircuit,
  upload: Upload,
  send: Send,
  search: Search,
  sort: ChevronsUpDown,
  spinner: Loader2,
};
