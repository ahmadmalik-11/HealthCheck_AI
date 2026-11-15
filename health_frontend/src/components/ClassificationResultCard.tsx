import {
  AlertCircle,
  CheckCircle2,
  MinusCircle,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import type { ClassificationResult, PredictionLabel } from '../types/classification';

interface ClassificationResultCardProps {
  result: ClassificationResult;
  onNewAnalysis: () => void;
}

interface LabelAppearance {
  heading: string;
  badgeText: string;
  containerStyle: string;
  headerStyle: string;
  iconBgStyle: string;
  headingColor: string;
  Icon: typeof CheckCircle2;
}

const APPEARANCE_MAP: Record<PredictionLabel, LabelAppearance> = {
  Supports: {
    heading: 'Claim Supported',
    badgeText: 'Supports',
    containerStyle: 'border-emerald-200 bg-white',
    headerStyle: 'bg-emerald-50/80 border-b border-emerald-200/80',
    iconBgStyle: 'bg-emerald-600 text-white',
    headingColor: 'text-emerald-950',
    Icon: CheckCircle2,
  },
  Refutes: {
    heading: 'Claim Refuted',
    badgeText: 'Refutes',
    containerStyle: 'border-red-200 bg-white',
    headerStyle: 'bg-red-50/80 border-b border-red-200/80',
    iconBgStyle: 'bg-red-600 text-white',
    headingColor: 'text-red-950',
    Icon: XCircle,
  },
  Neutral: {
    heading: 'Neutral Result',
    badgeText: 'Neutral',
    containerStyle: 'border-amber-200 bg-white',
    headerStyle: 'bg-amber-50/80 border-b border-amber-200/80',
    iconBgStyle: 'bg-amber-500 text-white',
    headingColor: 'text-amber-950',
    Icon: MinusCircle,
  },
};

export function ClassificationResultCard({
  result,
  onNewAnalysis,
}: ClassificationResultCardProps) {
  const appearance = APPEARANCE_MAP[result.prediction];
  const StatusIcon = appearance.Icon;

  return (
    <section
      aria-live="polite"
      aria-label="Classification Result"
      className={`overflow-hidden rounded-xl border shadow-sm ${appearance.containerStyle}`}
    >
      {/* Prominent Result Banner */}
      <div className={`px-6 py-5 sm:px-7 sm:py-6 ${appearance.headerStyle}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs ${appearance.iconBgStyle}`}
              aria-hidden="true"
            >
              <StatusIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-600">
                Classification Outcome · {appearance.badgeText}
              </p>
              <h2
                className={`mt-0.5 text-2xl font-bold tracking-tight ${appearance.headingColor}`}
              >
                {appearance.heading}
              </h2>
              <p className="mt-1 text-sm text-slate-700">{result.explanation}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNewAnalysis}
            className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-[#0F2942] shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" aria-hidden="true" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Detailed Result Breakdown */}
      <div className="space-y-6 p-6 sm:p-7">
        {result.isDemo && (
          <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm text-sky-950">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-700"
              aria-hidden="true"
            />
            <div>
              <span className="font-semibold">Demo Mode Result:</span>{' '}
              {result.demoReason ??
                'This classification was generated in frontend Demo Mode because the trained Python LinearSVC backend is not currently connected.'}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500">
              Original Health Claim
            </h3>
            <p className="mt-2 text-base leading-relaxed font-medium text-[#0F2942]">
              “{result.claim}”
            </p>
          </div>

          <div className="border-t border-slate-200 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500">
              Classification &amp; Margin
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-slate-600">Category</span>
                <span className="text-sm font-semibold text-[#0F2942]">
                  {result.prediction}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-slate-600">Decision Margin</span>
                <span className="font-mono text-sm font-semibold text-[#0F2942] tabular-nums">
                  {result.decisionMargin !== null
                    ? result.decisionMargin.toFixed(2)
                    : 'Not provided'}
                </span>
              </div>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
              LinearSVC decision margin represents the raw signed distance from the model’s separating hyperplane, not a percentage or calibrated probability.
            </p>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="flex items-start gap-3 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-600">
          <ShieldAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <p>
            This tool provides automated classification based on supplied evidence. It does not establish medical truth and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </section>
  );
}
