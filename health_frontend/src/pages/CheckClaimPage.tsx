import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Eraser,
  Loader2,
  SearchCheck,
  Server,
  Settings2,
} from 'lucide-react';
import { ClassificationResultCard } from '../components/ClassificationResultCard';
import {
  predictHealthClaim,
  SAMPLE_CLAIMS,
} from '../services/predictionService';
import type {
  ApiConfig,
  ClassificationResult,
  SampleClaim,
} from '../types/classification';

interface CheckClaimPageProps {
  apiConfig: ApiConfig;
  onApiConfigChange: (config: ApiConfig) => void;
}

interface ValidationErrors {
  claim?: string;
  evidence?: string;
}

export function CheckClaimPage({
  apiConfig,
  onApiConfigChange,
}: CheckClaimPageProps) {
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [showEndpointEditor, setShowEndpointEditor] = useState(false);

  const claimInputRef = useRef<HTMLTextAreaElement>(null);

  const handleLoadSample = (sample: SampleClaim) => {
    setClaim(sample.claim);
    setEvidence(sample.evidence);
    setErrors({});
    setApiError(null);
    setResult(null);
  };

  const handleClear = () => {
    setClaim('');
    setEvidence('');
    setErrors({});
    setApiError(null);
    setResult(null);
    claimInputRef.current?.focus();
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setApiError(null);
    setErrors({});
    setClaim('');
    setEvidence('');
    setTimeout(() => {
      claimInputRef.current?.focus();
    }, 0);
  };

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};
    if (!claim.trim()) {
      nextErrors.claim = 'Please enter a health-related claim before analyzing.';
    }
    if (!evidence.trim()) {
      nextErrors.evidence =
        'Please provide supporting or contextual evidence for the claim.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const predictionResult = await predictHealthClaim(
        { claim, evidence },
        apiConfig,
      );
      setResult(predictionResult);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while classifying the claim.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Prediction Mode Control */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2942] sm:text-3xl">
            Check a Claim
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Enter a health claim and its corresponding evidence to classify alignment.
          </p>
        </div>

        {/* Functional Mode Switcher: Demo Mode vs Live Python Backend */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1"
            role="group"
            aria-label="Prediction backend mode"
          >
            <button
              type="button"
              onClick={() => {
                onApiConfigChange({ ...apiConfig, mode: 'demo' });
                setApiError(null);
              }}
              className={`min-h-[34px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                apiConfig.mode === 'demo'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-600 hover:text-[#0F2942]'
              }`}
            >
              Demo Mode
            </button>
            <button
              type="button"
              onClick={() => {
                onApiConfigChange({ ...apiConfig, mode: 'api' });
                setApiError(null);
              }}
              className={`min-h-[34px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                apiConfig.mode === 'api'
                  ? 'bg-white text-[#0F2942] shadow-xs'
                  : 'text-slate-600 hover:text-[#0F2942]'
              }`}
            >
              Python API (/predict)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowEndpointEditor((prev) => !prev)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0F2942] whitespace-nowrap"
            aria-expanded={showEndpointEditor}
          >
            <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Endpoint</span>
          </button>
        </div>
      </div>

      {/* Mode Transparency Notice */}
      {apiConfig.mode === 'demo' ? (
        <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3.5 text-sm text-sky-950">
          <Server
            className="mt-0.5 h-4 w-4 shrink-0 text-sky-700"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            <span className="font-semibold">Demo Mode Active:</span> The trained
            Joblib LinearSVC backend is not connected in this preview. Results
            below are simulated sample outputs for demonstration. Switch to{' '}
            <button
              type="button"
              onClick={() => {
                onApiConfigChange({ ...apiConfig, mode: 'api' });
                setShowEndpointEditor(true);
              }}
              className="font-semibold text-teal-800 underline underline-offset-2 hover:text-teal-950"
            >
              Python API (/predict)
            </button>{' '}
            when your Flask or FastAPI server is running.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3.5 text-sm text-teal-950">
          <Server
            className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            <span className="font-semibold">Live Backend Mode:</span> Requests
            will be sent via{' '}
            <code className="font-mono text-xs font-semibold">POST</code> to{' '}
            <code className="font-mono text-xs font-semibold">
              {apiConfig.endpointUrl}
            </code>
            .
          </p>
        </div>
      )}

      {/* Optional Endpoint Configuration Drawer */}
      {showEndpointEditor && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <label
            htmlFor="api-endpoint-url"
            className="block text-xs font-semibold text-[#0F2942]"
          >
            Python Flask / FastAPI Prediction Endpoint
          </label>
          <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
            <input
              id="api-endpoint-url"
              type="url"
              value={apiConfig.endpointUrl}
              onChange={(e) =>
                onApiConfigChange({
                  ...apiConfig,
                  endpointUrl: e.target.value,
                })
              }
              placeholder="http://localhost:5000/predict"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-sm text-[#0F2942] focus:border-teal-600 focus:outline-2 focus:outline-teal-600/20"
            />
            <button
              type="button"
              onClick={() => setShowEndpointEditor(false)}
              className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-[#0F2942] hover:bg-slate-50 whitespace-nowrap"
            >
              Done
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Expected JSON payload:{' '}
            <code className="font-mono">
              {`{"claim": "...", "evidence": "..."}`}
            </code>{' '}
            returning{' '}
            <code className="font-mono">
              {`{"prediction": "Supports", "decision_margin": 0.85}`}
            </code>
            .
          </p>
        </div>
      )}

      {/* Quick Sample Loaders */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">
          Try a sample example:
        </span>
        {SAMPLE_CLAIMS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => handleLoadSample(sample)}
            className="min-h-[34px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0F2942] transition-colors hover:border-teal-300 hover:bg-teal-50/50 whitespace-nowrap"
          >
            {sample.label}: {sample.title}
          </button>
        ))}
      </div>

      {/* Classification Input Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="health-claim-input"
              className="block text-sm font-semibold text-[#0F2942]"
            >
              Health Claim
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              State the specific medical or health assertion to evaluate.
            </p>
            <textarea
              ref={claimInputRef}
              id="health-claim-input"
              rows={3}
              value={claim}
              onChange={(e) => {
                setClaim(e.target.value);
                if (errors.claim) {
                  setErrors((prev) => ({ ...prev, claim: undefined }));
                }
              }}
              placeholder="Enter a health-related claim here..."
              aria-invalid={Boolean(errors.claim)}
              aria-describedby={errors.claim ? 'claim-error' : undefined}
              className={`mt-2.5 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-[#0F2942] placeholder:text-slate-400 focus:outline-none ${
                errors.claim
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            {errors.claim && (
              <p
                id="claim-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-600"
              >
                {errors.claim}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="supporting-evidence-input"
              className="block text-sm font-semibold text-[#0F2942]"
            >
              Supporting Evidence
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Provide the reference text, research abstract, or clinical information to compare against the claim.
            </p>
            <textarea
              id="supporting-evidence-input"
              rows={6}
              value={evidence}
              onChange={(e) => {
                setEvidence(e.target.value);
                if (errors.evidence) {
                  setErrors((prev) => ({ ...prev, evidence: undefined }));
                }
              }}
              placeholder="Paste the evidence or information related to this claim here..."
              aria-invalid={Boolean(errors.evidence)}
              aria-describedby={errors.evidence ? 'evidence-error' : undefined}
              className={`mt-2.5 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-[#0F2942] placeholder:text-slate-400 focus:outline-none ${
                errors.evidence
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            {errors.evidence && (
              <p
                id="evidence-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-600"
              >
                {errors.evidence}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
          >
            <Eraser className="h-4 w-4 text-slate-500" aria-hidden="true" />
            Clear
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Analyzing Claim...</span>
              </>
            ) : (
              <>
                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                <span>Analyze Claim</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading Indicator Card */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-4 rounded-xl border border-sky-200 bg-sky-50/50 p-6"
        >
          <Loader2
            className="h-6 w-6 shrink-0 animate-spin text-teal-600"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-[#0F2942]">
              Running Classification Pipeline...
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              {apiConfig.mode === 'demo'
                ? 'Evaluating claim and evidence in Demo Mode.'
                : `Sending claim and evidence to ${apiConfig.endpointUrl}.`}
            </p>
          </div>
        </div>
      )}

      {/* Backend Error State */}
      {apiError && !isLoading && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/80 p-5 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-red-950">
                Classification Request Failed
              </p>
              <p className="mt-1 text-sm text-red-900">{apiError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onApiConfigChange({ ...apiConfig, mode: 'demo' });
              setApiError(null);
            }}
            className="min-h-[38px] shrink-0 self-start rounded-lg border border-red-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 whitespace-nowrap"
          >
            Switch to Demo Mode
          </button>
        </div>
      )}

      {/* Classification Result Card */}
      {result && !isLoading && (
        <ClassificationResultCard
          result={result}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </div>
  );
}
