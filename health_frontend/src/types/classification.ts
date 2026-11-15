export type PageId = 'dashboard' | 'check' | 'evaluation' | 'about';

export type PredictionLabel = 'Supports' | 'Refutes' | 'Neutral';

export interface PredictRequest {
  claim: string;
  evidence: string;
}

export interface PredictResponse {
  prediction: PredictionLabel;
  decision_margin?: number;
}

export interface ClassificationResult {
  claim: string;
  evidence: string;
  prediction: PredictionLabel;
  decisionMargin: number | null;
  explanation: string;
  isDemo: boolean;
  demoReason?: string;
}

export type PredictionMode = 'demo' | 'api';

export interface ApiConfig {
  mode: PredictionMode;
  endpointUrl: string;
}

export interface SampleClaim {
  id: string;
  label: PredictionLabel;
  title: string;
  claim: string;
  evidence: string;
  demoMargin: number;
}

export interface ClassMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  support: number;
}

export interface EvaluationData {
  accuracy?: number;
  macroAvg?: Omit<ClassMetrics, 'support'>;
  weightedAvg?: Omit<ClassMetrics, 'support'>;
  perClass?: {
    Supports: ClassMetrics;
    Refutes: ClassMetrics;
    Neutral: ClassMetrics;
  };
  confusionMatrix?: {
    labels: [PredictionLabel, PredictionLabel, PredictionLabel];
    matrix: [
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ];
  };
}
