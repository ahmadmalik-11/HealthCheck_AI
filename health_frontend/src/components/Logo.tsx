interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-sky-600 text-white shadow-sm"
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s-7-4.35-7-10.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 7 3.8C19 16.65 12 21 12 21Z" />
          <path d="m9.5 12.2 1.8 1.8 3.4-3.6" />
        </svg>
      </div>
      <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold tracking-tight text-[#0F2942] whitespace-nowrap">
        HealthCheckAI
      </span>
    </div>
  );
}
