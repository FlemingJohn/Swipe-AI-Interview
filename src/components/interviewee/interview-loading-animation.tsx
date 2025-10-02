export function InterviewLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="w-48 h-48 relative">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 animate-spin-slow"
          style={{ transformOrigin: '50% 50%' }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset="212"
            strokeLinecap="round"
          />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 animate-spin-medium"
          style={{ transformOrigin: '50% 50%' }}
        >
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.6"
            strokeWidth="2"
            fill="none"
            strokeDasharray="220"
            strokeDashoffset="165"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          >
            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
            <path d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
            <path d="M12 12v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" />
            <path d="M8 17a2 2 0 0 0 2 2h2" />
            <path d="M8 12H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-lg text-foreground">
          Preparing your interview...
        </p>
        <p className="text-sm text-muted-foreground">
          Crafting personalized questions just for you.
        </p>
      </div>
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-medium {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .animate-spin-medium {
          animation: spin-medium 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
