import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  FileText,
  MinusCircle,
  XCircle,
} from 'lucide-react';

const TECHNOLOGIES = [
  {
    name: 'Python',
    role: 'Core programming language for data preprocessing, model training, and API serving.',
  },
  {
    name: 'Scikit-learn',
    role: 'Machine learning library used to build, train, and serialize the classification pipeline.',
  },
  {
    name: 'TF-IDF Vectorization',
    role: 'Converts claim and evidence text into weighted word (unigram/bigram) and character n-gram features.',
  },
  {
    name: 'Linear Support Vector Machine (LinearSVC)',
    role: 'Separates claim-evidence pairs into Supports, Refutes, or Neutral using linear decision boundaries.',
  },
  {
    name: 'React & Tailwind CSS',
    role: 'Responsive web interface built for clear, non-technical healthcare claim analysis.',
  },
];

const WORKFLOW_STEPS = [
  { title: 'User Input', subtitle: 'Claim + Evidence', icon: FileText },
  { title: 'Text Processing', subtitle: 'Cleaning & normalization', icon: Code2 },
  {
    title: 'TF-IDF Feature Extraction',
    subtitle: 'Word & character n-grams',
    icon: Database,
  },
  {
    title: 'LinearSVC Classification',
    subtitle: 'Hyperplane scoring',
    icon: Cpu,
  },
  { title: 'Result', subtitle: 'Supports / Refutes / Neutral', icon: CheckCircle2 },
];

const CLASSIFICATION_CATEGORIES = [
  {
    label: 'Supports',
    title: 'Claim Supported',
    description:
      'The supplied evidence confirms, validates, or aligns directly with the health claim.',
    icon: CheckCircle2,
    iconClasses: 'bg-emerald-50 text-emerald-700',
    borderClasses: 'border-emerald-200/80',
  },
  {
    label: 'Refutes',
    title: 'Claim Refuted',
    description:
      'The supplied evidence directly contradicts, disproves, or conflicts with the health claim.',
    icon: XCircle,
    iconClasses: 'bg-red-50 text-red-700',
    borderClasses: 'border-red-200/80',
  },
  {
    label: 'Neutral',
    title: 'Neutral Result',
    description:
      'The supplied evidence is unrelated, inconclusive, or lacks sufficient detail to either support or refute the claim.',
    icon: MinusCircle,
    iconClasses: 'bg-amber-50 text-amber-700',
    borderClasses: 'border-amber-200/80',
  },
];

export function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Page Header & Purpose */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-teal-700">
          Project Documentation
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0F2942] sm:text-3xl">
          About HealthCheckAI
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
          <span className="font-semibold text-[#0F2942]">Purpose:</span>{' '}
          HealthCheckAI is designed to classify health-related claims by
          comparing them with supplied evidence using machine learning, helping
          users quickly understand whether the provided text supports, refutes,
          or remains neutral toward a statement.
        </p>
      </section>

      {/* Classification Workflow */}
      <section
        aria-labelledby="workflow-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <h2
          id="workflow-heading"
          className="text-lg font-bold tracking-tight text-[#0F2942]"
        >
          Classification Workflow
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Every claim and evidence pair passes through five structured stages.
        </p>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {WORKFLOW_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.title}
                className="flex flex-1 flex-col items-stretch lg:flex-row lg:items-center"
              >
                <div className="flex flex-1 flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700"
                    aria-hidden="true"
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-[#0F2942]">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className="flex items-center justify-center py-1 text-slate-400 lg:px-2 lg:py-0"
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Three Possible Classifications */}
      <section aria-labelledby="categories-heading" className="space-y-4">
        <div>
          <h2
            id="categories-heading"
            className="text-lg font-bold tracking-tight text-[#0F2942]"
          >
            Understanding the Three Classifications
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The LinearSVC model assigns each claim-evidence pair to one of three categories.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CLASSIFICATION_CATEGORIES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-xl border bg-white p-6 shadow-xs ${item.borderClasses}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconClasses}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      {item.label}
                    </p>
                    <h3 className="text-base font-bold text-[#0F2942]">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Used & Backend API Contract */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section
          aria-labelledby="tech-heading"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <h2
            id="tech-heading"
            className="text-lg font-bold tracking-tight text-[#0F2942]"
          >
            Technology Used
          </h2>
          <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
            {TECHNOLOGIES.map((tech) => (
              <li key={tech.name} className="py-3.5">
                <p className="text-sm font-semibold text-[#0F2942]">
                  {tech.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-600">{tech.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="api-contract-heading"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <h2
            id="api-contract-heading"
            className="text-lg font-bold tracking-tight text-[#0F2942]"
          >
            Backend Integration Contract
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            The trained Scikit-learn Joblib artifact can be served via Flask or
            FastAPI without modifying the frontend UI.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Endpoint Request (POST /predict)
              </p>
              <pre className="mt-1.5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs text-[#0F2942]">
{`{
  "claim": "Health-related claim",
  "evidence": "Supporting evidence"
}`}
              </pre>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500">
                Expected JSON Response
              </p>
              <pre className="mt-1.5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs text-[#0F2942]">
{`{
  "prediction": "Supports",
  "decision_margin": 0.85
}`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
