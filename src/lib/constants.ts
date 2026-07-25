export const ROLES = {
  FARMER: 'FARMER',
  CLAIMS_OFFICER: 'CLAIMS_OFFICER',
  UNDERWRITER: 'UNDERWRITER',
  TENANT_ADMIN: 'TENANT_ADMIN',
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
} as const;

export const CLAIM_STATUSES = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  INVESTIGATION: 'INVESTIGATION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
} as const;

export const CLAIM_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export const POLICY_STATUSES = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING',
} as const;

export const POLICY_PLAN_TYPES = {
  CROP: 'CROP',
  LIVESTOCK: 'LIVESTOCK',
  PROPERTY: 'PROPERTY',
  LIABILITY: 'LIABILITY',
  WEATHER: 'WEATHER',
} as const;

export const FRAUD_VERDICTS = {
  LOW_RISK: 'LOW_RISK',
  MEDIUM_RISK: 'MEDIUM_RISK',
  HIGH_RISK: 'HIGH_RISK',
  FRAUDULENT: 'FRAUDULENT',
} as const;

export const SUBSCRIPTION_TIERS = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE',
} as const;

export const FIELD_TYPES = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Select', value: 'select' },
  { label: 'Date', value: 'date' },
  { label: 'File', value: 'file' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Textarea', value: 'textarea' },
] as const;

export const APP_NAME = 'AIMS';
export const APP_FULL_NAME = 'Agricultural Insurance Management System';
export const APP_DESCRIPTION = 'A comprehensive platform for managing agricultural insurance policies, claims, and fraud detection.';
