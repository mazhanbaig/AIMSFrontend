export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'EXPIRED';
export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELED' | 'REFUNDED';

export interface Subscription {
  id: string;
  tenantId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  canceledAt?: string;
  features: SubscriptionFeatures;
  createdAt: string;
}

export interface SubscriptionFeatures {
  maxFarmers: number;
  maxStaff: number;
  maxPolicies: number;
  fraudDetection: boolean;
  analytics: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}

export interface Invoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  lineItems: InvoiceLineItem[];
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  period?: string;
}

export interface BillingUsage {
  farmers: number;
  policies: number;
  claims: number;
  storage: number;
  storageUnit: string;
  period: string;
}
