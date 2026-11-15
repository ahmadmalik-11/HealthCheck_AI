import type {
  ApiConfig,
  ClassificationResult,
  PredictRequest,
  PredictResponse,
  PredictionLabel,
  SampleClaim,
} from '../types/classification';

export const DEFAULT_API_ENDPOINT =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PREDICT_API_URL) ||
  'http://localhost:5000/predict';

export const SAMPLE_CLAIMS: SampleClaim[] = [
  {
    id: 'sample-supports',
    label: 'Supports',
    title: 'Vitamin D and Bone Health',
    claim:
      'Adequate vitamin D intake helps the body absorb calcium and supports bone mineral density in adults.',
    evidence:
      'Clinical nutrition studies demonstrate that vitamin D is essential for intestinal calcium absorption. Randomized controlled trials show that maintaining sufficient serum 25-hydroxyvitamin D levels alongside adequate calcium intake reduces bone loss and supports bone mineral density in older adults.',
    demoMargin: 0.85,
  },
  {
    id: 'sample-refutes',
    label: 'Refutes',
    title: 'Antibiotics for Viral Infections',
    claim:
      'Taking standard oral antibiotics speeds up recovery from the common cold and seasonal influenza.',
    evidence:
      'The common cold and influenza are caused by viruses, whereas antibiotics target bacterial infections only. Controlled clinical trials confirm that antibiotics provide no measurable benefit in shortening the duration or severity of uncomplicated viral upper respiratory infections and may cause adverse side effects.',
    demoMargin: -0.94,
  },
  {
    id: 'sample-neutral',
    label: 'Neutral',
    title: 'Green Tea and Long-Term Longevity',
    claim:
      'Drinking three cups of green tea every day guarantees a five-year increase in human life expectancy.',
    evidence:
      'Green tea contains polyphenols and antioxidants such as epigallocatechin gallate (EGCG). Several observational cohort studies have noted modest associations between regular green tea consumption and cardiovascular markers, though researchers note that lifestyle factors vary across populations and causal effects on specific lifespan extension remain inconclusive.',
    demoMargin: 0.12,
  },
];

const STANDARD_EXPLANATIONS: Record<PredictionLabel, string> = {
  Supports: 'The provided evidence supports the claim.',
  Refutes: 'The provided evidence contradicts the claim.',
  Neutral: 'The evidence does not clearly support or refute the claim.',
};

const NEGATION_CUES = [
  'no evidence',
  'not support',
  'does not',
  'do not',
  'cannot',
  'ineffective',
  'no benefit',
  'no measurable benefit',
  'contradict',
  'refute',
  'false',
  'myth',
  'caused by viruses',
  'rather than',
  'instead of',
  'harmful',
  'failed to',
  'unlike',
];

const SUPPORT_CUES = [
  'confirm',
  'demonstrate',
  'shows that',
  'show that',
  'proven',
  'effective',
  'reduces',
  'supports',
  'essential for',
  'associated with improved',
  'significantly lowered',
  'clinical trials show',
  'consistent with',
];

const UNCERTAINTY_CUES = [
  'inconclusive',
  'mixed results',
  'unclear',
  'further research',
  'limited evidence',
  'may or may not',
  'observational',
  'not yet established',
  'insufficient',
  'debate',
];

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function tokenizeWords(value: string): string[] {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(' ')
    .filter((token) => token.length > 3);
}

function runDemoClassifier(request: PredictRequest): ClassificationResult {
  const normClaim = normalizeText(request.claim);
  const normEvidence = normalizeText(request.evidence);

  const matchedSample = SAMPLE_CLAIMS.find(
    (sample) =>
      normalizeText(sample.claim) === normClaim &&
      normalizeText(sample.evidence) === normEvidence,
  );

  if (matchedSample) {
    return {
      claim: request.claim.trim(),
      evidence: request.evidence.trim(),
      prediction: matchedSample.label,
      decisionMargin: matchedSample.demoMargin,
      explanation: STANDARD_EXPLANATIONS[matchedSample.label],
      isDemo: true,
      demoReason:
        'Demo Mode sample output. Connect your Python Flask or FastAPI backend to classify using the trained LinearSVC Joblib model.',
    };
  }

  const claimTokens = new Set(tokenizeWords(request.claim));
  const evidenceTokens = new Set(tokenizeWords(request.evidence));
  let overlapCount = 0;
  claimTokens.forEach((token) => {
    if (evidenceTokens.has(token)) {
      overlapCount += 1;
    }
  });
  const overlapRatio = claimTokens.size > 0 ? overlapCount / claimTokens.size : 0;

  const negationHits = NEGATION_CUES.filter((cue) => normEvidence.includes(cue)).length;
  const supportHits = SUPPORT_CUES.filter((cue) => normEvidence.includes(cue)).length;
  const uncertaintyHits = UNCERTAINTY_CUES.filter((cue) => normEvidence.includes(cue)).length;

  let prediction: PredictionLabel = 'Neutral';
  let decisionMargin = 0.18;

  if (overlapRatio < 0.15 || uncertaintyHits > Math.max(supportHits, negationHits)) {
    prediction = 'Neutral';
    decisionMargin = Number((0.08 + Math.min(overlapRatio, 0.25) * 0.4).toFixed(2));
  } else if (negationHits > supportHits) {
    prediction = 'Refutes';
    decisionMargin = Number((-0.42 - Math.min(negationHits * 0.18, 0.55)).toFixed(2));
  } else if (supportHits > 0 || overlapRatio >= 0.45) {
    prediction = 'Supports';
    decisionMargin = Number((0.45 + Math.min(supportHits * 0.15 + overlapRatio * 0.25, 0.55)).toFixed(2));
  }

  return {
    claim: request.claim.trim(),
    evidence: request.evidence.trim(),
    prediction,
    decisionMargin,
    explanation: STANDARD_EXPLANATIONS[prediction],
    isDemo: true,
    demoReason:
      'Demo Mode preview result. This simulation is for demonstration only and does not reflect the trained LinearSVC Joblib artifact.',
  };
}

function isValidPredictionLabel(value: unknown): value is PredictionLabel {
  return value === 'Supports' || value === 'Refutes' || value === 'Neutral';
}

export async function predictHealthClaim(
  request: PredictRequest,
  config: ApiConfig,
): Promise<ClassificationResult> {
  const cleanedRequest: PredictRequest = {
    claim: request.claim.trim(),
    evidence: request.evidence.trim(),
  };

  if (config.mode === 'demo') {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return runDemoClassifier(cleanedRequest);
  }

  const targetUrl = config.endpointUrl.trim();
  if (!targetUrl) {
    throw new Error('Please enter a valid backend API URL (e.g., http://localhost:5000/predict).');
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedRequest),
    });
  } catch {
    throw new Error(
      `Unable to reach the prediction backend at ${targetUrl}. Verify that your Python Flask or FastAPI server is running with CORS enabled, or switch to Demo Mode.`,
    );
  }

  if (!response.ok) {
    let errorDetail = `Backend responded with HTTP ${response.status}.`;
    try {
      const errorBody = (await response.json()) as { detail?: string; error?: string };
      if (errorBody.detail) {
        errorDetail = errorBody.detail;
      } else if (errorBody.error) {
        errorDetail = errorBody.error;
      }
    } catch {
      // Ignore JSON parse failures on non-JSON error responses
    }
    throw new Error(errorDetail);
  }

  const data = (await response.json()) as Partial<PredictResponse>;
  if (!isValidPredictionLabel(data.prediction)) {
    throw new Error(
      'Unexpected response format from backend. Expected JSON with "prediction" set to "Supports", "Refutes", or "Neutral".',
    );
  }

  const decisionMargin =
    typeof data.decision_margin === 'number' && Number.isFinite(data.decision_margin)
      ? data.decision_margin
      : null;

  return {
    claim: cleanedRequest.claim,
    evidence: cleanedRequest.evidence,
    prediction: data.prediction,
    decisionMargin,
    explanation: STANDARD_EXPLANATIONS[data.prediction],
    isDemo: false,
  };
}
