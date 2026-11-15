import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileSearch,
  FileText,
  Layers,
  Sparkles,
  Target,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import type { PageId } from '../types/classification';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

const STEPS = [
  {
    number: '01',
    title: 'Enter a Health Claim',
    description:
      'Type or paste the health-related statement you want to verify against source evidence.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Provide Supporting Evidence',
    description:
      'Supply the relevant clinical excerpt, study summary, or reference text to evaluate against the claim.',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Get AI Classification',
    description:
      'The TF-IDF + LinearSVC pipeline classifies whether the evidence Supports, Refutes, or is Neutral toward the claim.',
    icon: CheckCircle2,
  },
];

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50/70 via-white to-teal-50/60 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-teal-700">
              Evidence-Based Claim Verification
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2942] sm:text-4xl">
              Welcome to HealthCheckAI
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Analyze health claims using AI-powered evidence classification.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('check')}
              className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap"
            >
              <span>Analyze a Claim</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section aria-label="Model Overview Statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Model"
            value="LinearSVC"
            sublabel="TF-IDF feature pipeline"
            icon={Cpu}
            tone="teal"
          />
          <StatCard
            label="Classification Categories"
            value="3"
            sublabel="Supports, Refutes, Neutral"
            icon={Layers}
            tone="sky"
          />
          <StatCard
            label="Test Accuracy"
            value="79.04%"
            sublabel="Held-out evaluation benchmark"
            icon={Target}
            tone="teal"
          />
          <StatCard
            label="Input Requirements"
            value="Claim + Evidence"
            sublabel="Paired text comparison"
            icon={Sparkles}
            tone="sky"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        aria-labelledby="how-it-works-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="how-it-works-heading"
              className="text-xl font-bold tracking-tight text-[#0F2942]"
            >
              How It Works
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              A straightforward three-step workflow designed for clear, accessible verification.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="self-start text-sm font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline sm:self-auto whitespace-nowrap"
          >
            Learn about the methodology
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.number}
                className="flex flex-col rounded-xl border border-slate-200/90 bg-slate-50/50 p-5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700"
                    aria-hidden="true"
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#0F2942]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
