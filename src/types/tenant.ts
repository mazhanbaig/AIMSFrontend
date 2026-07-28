export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  config?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  adminEmail: string;
  logoUrl?: string;
  billingEnabled?: boolean;
}
