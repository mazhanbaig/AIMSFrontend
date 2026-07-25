export interface FraudTier {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  scoreRange: {
    min: number;
    max: number;
  };
  color: string;
  rules: FraudRule[];
  isActive: boolean;
  createdAt: string;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'between';
  value: any;
  score: number;
  weight: number;
  isActive: boolean;
}

export interface FraudAnalysis {
  claimId: string;
  score: number;
  verdict: FraudVerdict;
  details: FraudAnalysisDetail[];
  analyzedAt: string;
}

export type FraudVerdict = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'FRAUDULENT';

export interface FraudAnalysisDetail {
  ruleName: string;
  ruleDescription: string;
  score: number;
  weight: number;
  matched: boolean;
  detail: string;
}
