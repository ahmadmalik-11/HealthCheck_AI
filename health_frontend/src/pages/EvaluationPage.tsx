import { useRef, useState } from 'react';
import {
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
  Target,
  Upload,
} from 'lucide-react';
import type { EvaluationData, PredictionLabel } from '../types/classification';

const HELD_OUT_TEST_ACCURACY = 79.04;
const TARGET_ACCURACY = 85.0;
const ACCURACY_GAP = (TARGET_ACCURACY - HELD_OUT_TEST_ACCURACY).toFixed(2);

const MODEL_SPECS = [
  { label: 'Algorithm', value: 'LinearSVC' },
  { label: 'Feature Extraction', value: 'TF-IDF' },
  { label: 'Word Features', value: 'Unigrams and Bigrams' },
  { label: 'Character Features', value: 'Character n-grams' },
  { label: 'Classification Type', value: 'Three-Class Classification' },
];

const CLASS_LABELS: PredictionLabel[] = ['Supports', 'Refutes', 'Neutral'];

function isValidEvaluationJson(raw: unknown): raw is EvaluationData {
  if (!raw || typeof raw !== 'object') return false;
  const obj = raw as Record<string, unknown>;
  const hasPerClass = Boolean(obj.perClass && typeof obj.perClass === 'object');
  const hasMatrix = Boolean(
    obj.confusionMatrix && typeof obj.confusionMatrix === 'object',
  );
  return hasPerClass || hasMatrix || typeof obj.accuracy === 'number';
}

export function EvaluationPage() {
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(
    null,
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedAccuracy =
    typeof evaluationData?.accuracy === 'number'
      ? evaluationData.accuracy
      : HELD_OUT_TEST_ACCURACY;

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      if (!isValidEvaluationJson(parsed)) {
        setUploadError(
          'Invalid JSON structure. Expected keys such as "perClass", "confusionMatrix", or "accuracy".',
        );
        return;
      }
      setEvaluationData(parsed);
    } catch {
      setUploadError('Unable to parse the selected JSON evaluation file.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2942] sm:text-3xl">
            Evaluation &amp; Performance
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Model architecture specifications, benchmark accuracy, and classification metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Load evaluation JSON file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-[#0F2942] shadow-xs transition-colors hover:bg-slate-50 whitespace-nowrap"
          >
            <Upload className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
            <span>Load Evaluation JSON</span>
          </button>

          {evaluationData && (
            <button
              type="button"
              onClick={() => {
                setEvaluationData(null);
                setUploadError(null);
              }}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear Loaded Data</span>
            </button>
          )}
        </div>
      </div>

      {uploadError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-900"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
            aria-hidden="true"
          />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Model Information & Accuracy Comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Model Information */}
        <section
          aria-labelledby="model-info-heading"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <h2
            id="model-info-heading"
            className="text-lg font-bold tracking-tight text-[#0F2942]"
          >
            Model Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Configuration of the trained classification pipeline.
          </p>

          <dl className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
            {MODEL_SPECS.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between gap-4 py-3.5 text-sm"
              >
                <dt className="text-slate-600">{spec.label}</dt>
                <dd className="font-semibold text-[#0F2942] text-right">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Accuracy vs Target Section */}
        <section
          aria-labelledby="accuracy-heading"
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="accuracy-heading"
                  className="text-lg font-bold tracking-tight text-[#0F2942]"
                >
                  Accuracy
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Held-out test accuracy compared against the project target.
                </p>
              </div>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700"
                aria-hidden="true"
              >
                <Target className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Held-out Test Accuracy
                </p>
                <p className="mt-1.5 font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#0F2942] tabular-nums">
                  {displayedAccuracy.toFixed(2)}%
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Target Accuracy
                </p>
                <p className="mt-1.5 font-['Plus_Jakarta_Sans'] text-3xl font-bold text-teal-700 tabular-nums">
                  {TARGET_ACCURACY.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Clean Progress Comparison Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 tabular-nums">
                <span>Current: {displayedAccuracy.toFixed(2)}%</span>
                <span>Target: {TARGET_ACCURACY.toFixed(2)}%</span>
              </div>
              <div
                className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={displayedAccuracy}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Held-out test accuracy compared to 85% target"
              >
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${Math.min(displayedAccuracy, 100)}%` }}
                />
                <div
                  className="absolute inset-y-0 w-0.5 bg-teal-700"
                  style={{ left: `${TARGET_ACCURACY}%` }}
                  title="85% Target Accuracy"
                />
              </div>
            </div>
          </div>

          {/* Explicit Below-Target Notice */}
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <span className="font-semibold">Below Target Benchmark:</span> The
              current model accuracy ({displayedAccuracy.toFixed(2)}%) is{' '}
              <span className="font-mono font-semibold tabular-nums">
                {displayedAccuracy < TARGET_ACCURACY
                  ? `${(TARGET_ACCURACY - displayedAccuracy).toFixed(2)}%`
                  : `${ACCURACY_GAP}%`}
              </span>{' '}
              below the {TARGET_ACCURACY.toFixed(0)}% target accuracy. Further
              feature tuning or larger training datasets are required to reach the target.
            </p>
          </div>
        </section>
      </div>

      {/* Precision, Recall & F1-Score Section */}
      <section
        aria-labelledby="classification-metrics-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="classification-metrics-heading"
              className="text-lg font-bold tracking-tight text-[#0F2942]"
            >
              Precision, Recall &amp; F1-Score
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Per-class evaluation metrics from the held-out test split.
            </p>
          </div>
        </div>

        {evaluationData?.perClass ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3 pr-4">Class</th>
                  <th className="px-4 py-3 text-right">Precision</th>
                  <th className="px-4 py-3 text-right">Recall</th>
                  <th className="px-4 py-3 text-right">F1-Score</th>
                  <th className="py-3 pl-4 text-right">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CLASS_LABELS.map((label) => {
                  const row = evaluationData.perClass?.[label];
                  if (!row) return null;
                  return (
                    <tr key={label} className="hover:bg-slate-50/70">
                      <td className="py-3 pr-4 font-semibold text-[#0F2942]">
                        {label}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                        {row.precision.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                        {row.recall.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                        {row.f1Score.toFixed(4)}
                      </td>
                      <td className="py-3 pl-4 text-right font-mono tabular-nums text-slate-600">
                        {row.support}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {['Precision', 'Recall', 'F1-Score'].map((metricName) => (
              <div
                key={metricName}
                className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#0F2942]">
                    {metricName}
                  </h3>
                  <FileSpreadsheet
                    className="h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Evaluation data not connected. Load the Python evaluation report JSON to display verified {metricName.toLowerCase()} scores per class.
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Confusion Matrix Section */}
      <section
        aria-labelledby="confusion-matrix-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
      >
        <h2
          id="confusion-matrix-heading"
          className="text-lg font-bold tracking-tight text-[#0F2942]"
        >
          Confusion Matrix
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Predicted vs. actual classification counts across Supports, Refutes, and Neutral.
        </p>

        {evaluationData?.confusionMatrix ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full max-w-2xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3 pr-4 text-left">Actual \ Predicted</th>
                  {evaluationData.confusionMatrix.labels.map((label) => (
                    <th key={label} className="px-4 py-3 text-center">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluationData.confusionMatrix.matrix.map((row, rowIdx) => (
                  <tr key={evaluationData.confusionMatrix?.labels[rowIdx]}>
                    <th
                      scope="row"
                      className="py-3 pr-4 text-left font-semibold text-[#0F2942]"
                    >
                      {evaluationData.confusionMatrix?.labels[rowIdx]}
                    </th>
                    {row.map((cellValue, colIdx) => {
                      const isDiagonal = rowIdx === colIdx;
                      return (
                        <td
                          key={colIdx}
                          className={`px-4 py-3 text-center font-mono tabular-nums ${
                            isDiagonal
                              ? 'bg-teal-50/80 font-bold text-teal-900'
                              : 'text-slate-700'
                          }`}
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#0F2942]">
                Confusion Matrix Data Not Loaded
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                No fabricated or placeholder matrix counts are displayed. Connect your Python evaluation output or click{' '}
                <span className="font-medium text-[#0F2942]">
                  Load Evaluation JSON
                </span>{' '}
                above to render actual confusion matrix values from your test run.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-[#0F2942] hover:bg-slate-50 whitespace-nowrap"
            >
              <Upload className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
              <span>Load Data</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
