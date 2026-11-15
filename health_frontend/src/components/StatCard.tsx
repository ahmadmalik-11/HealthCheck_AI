import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: 'teal' | 'sky';
}

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone = 'teal',
}: StatCardProps) {
  const iconColors =
    tone === 'teal'
      ? 'bg-teal-50 text-teal-700'
      : 'bg-sky-50 text-sky-700';

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconColors}`}
          aria-hidden="true"
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="mt-3">
        <p className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-[#0F2942] tabular-nums">
          {value}
        </p>
        {sublabel && (
          <p className="mt-1 text-xs text-slate-500">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
