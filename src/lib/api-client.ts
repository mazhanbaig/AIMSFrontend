import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { UserRole } from '@/types';
import { getSession, signOut } from 'next-auth/react';
import { getTenantSlug } from './tenant';

/**
 * Axios instance configured for AIMS backend API
 * - Base URL from environment
 * - Auth interceptor adds Bearer token
 * - Tenant interceptor adds x-tenant-slug header
 * - Response interceptor handles 401 redirects
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - adds auth token and tenant header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token from NextAuth session
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch {
      // Session fetch failed, proceed without token
    }

    // Add tenant header
    const tenantSlug = getTenantSlug();
    if (tenantSlug) {
      config.headers['x-tenant-slug'] = tenantSlug;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        signOut({ redirect: true, callbackUrl: '/login' });
      }
    }
    return Promise.reject(error);
  }
);

// =====================
// AUTH API
// =====================
export const authApi = {
  getMe: () => apiClient.get('/api/v1/auth/me'),
  updateProfile: (data: any) => apiClient.patch('/api/v1/auth/profile', data),
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    tenantSlug?: string;
  }) => apiClient.post('/api/v1/auth/register', data),
  /**
   * OAuth callback - called after Google/GitHub sign-in to create or fetch
   * the user in the backend database and return their role/tenantId/permissions.
   * The backend creates the user if they don't exist, or returns existing data.
   */
  oauthCallback: (data: {
    email: string;
    name: string;
    avatar?: string;
    provider: 'google' | 'github';
    providerAccountId: string;
  }) => apiClient.post('/api/v1/auth/oauth/callback', data),
  /**
   * Complete OAuth setup - called after the user selects their role and tenant
   * on the post-signup setup page. Updates the user's profile and redirects to dashboard.
   */
  completeOAuthSetup: (data: {
    role: UserRole;
    tenantSlug?: string;
    phone?: string;
  }) => apiClient.post('/api/v1/auth/oauth/setup', data),
};

// =====================
// FARMER API
// =====================
export const farmerApi = {
  getProfile: () => apiClient.get('/api/v1/farmers/profile'),
  createProfile: (data: any) => apiClient.post('/api/v1/farmers/profile', data),
  updateProfile: (data: any) => apiClient.patch('/api/v1/farmers/profile', data),
  getFields: () => apiClient.get('/api/v1/farmers/fields'),
  list: (params?: any) => apiClient.get('/api/v1/farmers', { params }),
  get: (id: string) => apiClient.get(`/api/v1/farmers/${id}`),
};

// =====================
// LAND PARCEL API
// =====================
export const landParcelApi = {
  list: (params?: any) => apiClient.get('/api/v1/land-parcels', { params }),
  get: (id: string) => apiClient.get(`/api/v1/land-parcels/${id}`),
  create: (data: any) => apiClient.post('/api/v1/land-parcels', data),
  update: (id: string, data: any) => apiClient.patch(`/api/v1/land-parcels/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/land-parcels/${id}`),
};

// =====================
// POLICY PLAN API
// =====================
export const policyPlanApi = {
  list: (params?: any) => apiClient.get('/api/v1/policy-plans', { params }),
  get: (id: string) => apiClient.get(`/api/v1/policy-plans/${id}`),
  create: (data: any) => apiClient.post('/api/v1/policy-plans', data),
  update: (id: string, data: any) => apiClient.patch(`/api/v1/policy-plans/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/policy-plans/${id}`),
  quote: (data: any) => apiClient.post('/api/v1/policy-plans/quote', data),
};

// =====================
// POLICY API
// =====================
export const policyApi = {
  list: (params?: any) => apiClient.get('/api/v1/policies', { params }),
  get: (id: string) => apiClient.get(`/api/v1/policies/${id}`),
  purchase: (data: any) => apiClient.post('/api/v1/policies/purchase', data),
};

// =====================
// CLAIM API
// =====================
export const claimApi = {
  list: (params?: any) => apiClient.get('/api/v1/claims', { params }),
  get: (id: string) => apiClient.get(`/api/v1/claims/${id}`),
  create: (data: any) => apiClient.post('/api/v1/claims', data),
  updateStatus: (id: string, data: any) =>
    apiClient.patch(`/api/v1/claims/${id}/status`, data),
  assign: (id: string, data: any) =>
    apiClient.patch(`/api/v1/claims/${id}/assign`, data),
  listAll: (params?: any) => apiClient.get('/api/v1/claims/admin/all', { params }),
  getFraudAnalysis: (id: string) =>
    apiClient.get(`/api/v1/claims/${id}/fraud-analysis`),
  addNote: (id: string, data: any) =>
    apiClient.post(`/api/v1/claims/${id}/notes`, data),
};

// =====================
// DOCUMENT API
// =====================
export const documentApi = {
  upload: (formData: FormData) =>
    apiClient.post('/api/v1/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: (claimId: string) => apiClient.get(`/api/v1/documents/claim/${claimId}`),
  get: (id: string) => apiClient.get(`/api/v1/documents/${id}`),
  delete: (id: string) => apiClient.delete(`/api/v1/documents/${id}`),
};

// =====================
// NOTIFICATION API
// =====================
export const notificationApi = {
  list: (params?: any) => apiClient.get('/api/v1/notifications', { params }),
  markRead: (data: { ids: string[] }) => apiClient.patch('/api/v1/notifications/read', data),
  markAllRead: () => apiClient.patch('/api/v1/notifications/read-all'),
  getUnreadCount: () => apiClient.get('/api/v1/notifications/unread-count'),
};

// =====================
// ADMIN API
// =====================
export const adminApi = {
  getDashboard: () => apiClient.get('/api/v1/admin/dashboard'),
  getAnalytics: (params?: any) => apiClient.get('/api/v1/admin/analytics/claims', { params }),
  getAnalyticsRevenue: (params?: any) =>
    apiClient.get('/api/v1/admin/analytics/revenue', { params }),
  listStaff: (params?: any) => apiClient.get('/api/v1/admin/staff', { params }),
  createStaff: (data: any) => apiClient.post('/api/v1/admin/staff', data),
  updateStaff: (id: string, data: any) =>
    apiClient.patch(`/api/v1/admin/staff/${id}`, data),
  toggleStaff: (id: string) =>
    apiClient.patch(`/api/v1/admin/staff/${id}/toggle-status`),
  getStaff: (id: string) => apiClient.get(`/api/v1/admin/staff/${id}`),
};

// =====================
// PLATFORM API
// =====================
export const platformApi = {
  listTenants: (params?: any) => apiClient.get('/api/v1/platform/tenants', { params }),
  getTenant: (id: string) => apiClient.get(`/api/v1/platform/tenants/${id}`),
  createTenant: (data: any) => apiClient.post('/api/v1/platform/tenants', data),
  updateTenant: (id: string, data: any) =>
    apiClient.patch(`/api/v1/platform/tenants/${id}`, data),
  deleteTenant: (id: string) =>
    apiClient.delete(`/api/v1/platform/tenants/${id}`),
  seedTenant: (id: string) =>
    apiClient.post(`/api/v1/platform/tenants/${id}/seed`),
  getPlatformAnalytics: (params?: any) =>
    apiClient.get('/api/v1/platform/analytics', { params }),
};

// =====================
// SETTINGS API
// =====================
export const settingsApi = {
  getSettings: () => apiClient.get('/api/v1/settings'),
  updateSettings: (data: any) => apiClient.patch('/api/v1/settings', data),
  getFraudTier: () => apiClient.get('/api/v1/settings/fraud-tier'),
  updateFraudTier: (data: any) => apiClient.patch('/api/v1/settings/fraud-tier', data),
  getPaymentGateway: () => apiClient.get('/api/v1/settings/payment-gateway'),
  updatePaymentGateway: (data: any) =>
    apiClient.patch('/api/v1/settings/payment-gateway', data),
};

// =====================
// TENANT FIELD API
// =====================
export const tenantFieldApi = {
  list: () => apiClient.get('/api/v1/settings/fields'),
  get: (id: string) => apiClient.get(`/api/v1/settings/fields/${id}`),
  create: (data: any) => apiClient.post('/api/v1/settings/fields', data),
  update: (id: string, data: any) =>
    apiClient.patch(`/api/v1/settings/fields/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/settings/fields/${id}`),
};

// =====================
// IAM API
// =====================
export const iamApi = {
  listRoles: () => apiClient.get('/api/v1/iam/roles'),
  getRole: (id: string) => apiClient.get(`/api/v1/iam/roles/${id}`),
  createRole: (data: any) => apiClient.post('/api/v1/iam/roles', data),
  updateRole: (id: string, data: any) =>
    apiClient.patch(`/api/v1/iam/roles/${id}`, data),
  deleteRole: (id: string) => apiClient.delete(`/api/v1/iam/roles/${id}`),
  assignRole: (data: any) => apiClient.post('/api/v1/iam/roles/assign', data),
  getPermissions: () => apiClient.get('/api/v1/iam/permissions'),
  getMyPermissions: () => apiClient.get('/api/v1/iam/permissions/mine'),
};

// =====================
// BILLING API
// =====================
export const billingApi = {
  subscribe: (tier: string) => apiClient.post('/api/v1/billing/subscribe', { tier }),
  cancel: () => apiClient.post('/api/v1/billing/cancel'),
  getStatus: () => apiClient.get('/api/v1/billing/status'),
  getUsage: () => apiClient.get('/api/v1/billing/usage'),
  listInvoices: (params?: any) => apiClient.get('/api/v1/billing/invoices', { params }),
  getInvoice: (id: string) => apiClient.get(`/api/v1/billing/invoices/${id}`),
  payInvoice: (id: string) => apiClient.post(`/api/v1/billing/invoices/${id}/pay`),
  generateInvoice: () => apiClient.post('/api/v1/billing/invoices/generate'),
};

// =====================
// IMPORT API
// =====================
export const importApi = {
  importPolicyPlans: (formData: FormData) =>
    apiClient.post('/api/v1/import/policy-plans', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  importFarmersPolicies: (formData: FormData) =>
    apiClient.post('/api/v1/import/farmers-policies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getJobStatus: (jobId: string) =>
    apiClient.get(`/api/v1/import/jobs/${jobId}`),
};

// =====================
// HEALTH API
// =====================
export const healthApi = {
  check: () => apiClient.get('/api/v1/health'),
};

export default apiClient;
