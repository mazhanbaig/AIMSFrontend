export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
export type PolicyPlanType = 'CROP' | 'LIVESTOCK' | 'PROPERTY' | 'LIABILITY' | 'WEATHER';

export interface PolicyPlan {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: PolicyPlanType;
  coverage: string;
  premium: number;
  premiumCurrency: string;
  deductible: number;
  maxCoverage: number;
  durationMonths: number;
  cropType?: string;
  livestockType?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  id: string;
  farmerId: string;
  policyPlanId: string;
  policyPlan?: PolicyPlan;
  policyNumber: string;
  status: PolicyStatus;
  startDate: string;
  endDate: string;
  premium: number;
  premiumCurrency: string;
  sumInsured: number;
  deductible: number;
  parcelId?: string;
  parcel?: any;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PurchasePolicyInput {
  policyPlanId: string;
  parcelId?: string;
  startDate: string;
  metadata?: Record<string, any>;
}

export interface QuoteInput {
  policyPlanId: string;
  sumInsured: number;
  durationMonths: number;
  parcelId?: string;
}

export interface QuoteResponse {
  premium: number;
  deductible: number;
  maxCoverage: number;
  totalPremium: number;
  currency: string;
}
