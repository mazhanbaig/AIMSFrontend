export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  primaryColor?: string;
  isActive: boolean;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  settings?: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  enableFraudDetection: boolean;
  enableBilling: boolean;
  enableNotifications: boolean;
  maxFarmers?: number;
  maxPolicies?: number;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  language: string;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  primaryColor?: string;
  subscriptionTier?: string;
}
