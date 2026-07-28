export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

export interface PolicyPlan {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  cropType: string;
  coveragePerAcre: number;
  premiumRate: number;
  minAreaAcres?: number;
  maxAreaAcres?: number;
  termMonths: number;
  isActive: boolean;
  config?: Record<string, any>;
  createdAt: string;
}

export interface Policy {
  id: string;
  farmerId: string;
  policyPlanId: string;
  policyPlan?: PolicyPlan;
  landParcelId: string;
  landParcel?: any;
  policyNumber: string;
  status: PolicyStatus;
  coverageAmount: number;
  premiumAmount: number;
  premiumPaid: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface PurchasePolicyInput {
  policyPlanId: string;
  landParcelId: string;
  startDate: string;
}

export interface QuoteInput {
  policyPlanId: string;
  areaAcres: number;
  termMonths: number;
}

export interface QuoteResponse {
  premium: number;
  deductible: number;
  maxCoverage: number;
  totalPremium: number;
  currency: string;
}
