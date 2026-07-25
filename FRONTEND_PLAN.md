# 🎨 AIMS Frontend — Comprehensive Implementation Plan

> **Complete blueprint for building the Next.js frontend that connects to your AIMS backend**

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Pages & Routes](#4-pages--routes)
5. [Authentication Flow](#5-authentication-flow)
6. [API Integration](#6-api-integration)
7. [State Management](#7-state-management)
8. [UI Components](#8-ui-components)
9. [Multi-Tenant Handling](#9-multi-tenant-handling)
10. [Dynamic Forms](#10-dynamic-forms)
11. [Phase-by-Phase Implementation](#11-phase-by-phase-implementation)
12. [Environment Variables](#12-environment-variables)
13. [Deployment](#13-deployment)

---

## 1. Project Overview

### What We're Building

A **Next.js 14+** frontend application that connects to the AIMS backend API. It provides interfaces for:

| User Type | What They See |
|-----------|---------------|
| **Farmers** | Register, buy policies, file claims, track status |
| **Insurance Staff** | Manage farmers, policies, claims, fraud review |
| **Tenant Admins** | Dashboard, staff management, settings, billing |
| **Platform Admins** | Tenant management, platform oversight |

### Key Features

- **Multi-tenant aware** — Subdomain-based tenant isolation
- **Dynamic forms** — Rendered from backend JSON config
- **Real-time updates** — Claim status, notifications
- **Role-based UI** — Different views per user role
- **File uploads** — Images, videos, PDFs to Cloudinary
- **Fraud dashboard** — Visualize fraud scores and verdicts

---

## 2. Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 14+ | React framework with App Router |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **UI Components** | shadcn/ui | Latest | Pre-built accessible components |
| **State Management** | Zustand | 4.x | Global state |
| **Data Fetching** | TanStack Query | 5.x | Server state management |
| **Forms** | React Hook Form | 7.x | Form handling |
| **Validation** | Zod | 4.x | Schema validation |
| **HTTP Client** | Axios | 1.x | API calls |
| **File Upload** | react-dropzone | 14.x | Drag-and-drop uploads |
| **Charts** | Recharts | 2.x | Dashboard visualizations |
| **Notifications** | react-hot-toast | 2.x | User notifications |

---

## 3. Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Protected layout with sidebar
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   ├── farmers/
│   │   │   │   ├── page.tsx        # List farmers
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx    # Farmer detail
│   │   │   │   └── create/
│   │   │   │       └── page.tsx    # Create farmer
│   │   │   ├── policies/
│   │   │   │   ├── page.tsx        # List policies
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx    # Policy detail
│   │   │   │   └── purchase/
│   │   │   │       └── page.tsx    # Purchase policy
│   │   │   ├── claims/
│   │   │   │   ├── page.tsx        # List claims
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx    # Claim detail
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx    # Submit claim
│   │   │   │   └── review/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx # Review claim (staff)
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx    # Admin dashboard
│   │   │   │   ├── staff/
│   │   │   │   │   ├── page.tsx    # Manage staff
│   │   │   │   │   └── create/
│   │   │   │   │       └── page.tsx # Create staff
│   │   │   │   ├── settings/
│   │   │   │   │   ├── page.tsx    # Settings
│   │   │   │   │   ├── fields/
│   │   │   │   │   │   └── page.tsx # Custom fields
│   │   │   │   │   ├── fraud/
│   │   │   │   │   │   └── page.tsx # Fraud tier config
│   │   │   │   │   └── iam/
│   │   │   │   │       └── page.tsx # IAM roles
│   │   │   │   └── billing/
│   │   │   │       ├── page.tsx    # Billing overview
│   │   │   │       └── invoices/
│   │   │   │           └── [id]/
│   │   │   │               └── page.tsx # Invoice detail
│   │   │   ├── platform/
│   │   │   │   ├── tenants/
│   │   │   │   │   ├── page.tsx    # List tenants
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx # Tenant detail
│   │   │   │   │   └── create/
│   │   │   │   │       └── page.tsx # Create tenant
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx    # Platform analytics
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx        # Notification center
│   │   │   └── profile/
│   │   │       └── page.tsx        # User profile
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts    # NextAuth.js config
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── farmers/
│   │   │   ├── FarmerForm.tsx
│   │   │   ├── FarmerCard.tsx
│   │   │   └── FarmerList.tsx
│   │   ├── policies/
│   │   │   ├── PolicyForm.tsx
│   │   │   ├── PolicyCard.tsx
│   │   │   └── PolicyList.tsx
│   │   ├── claims/
│   │   │   ├── ClaimForm.tsx
│   │   │   ├── ClaimCard.tsx
│   │   │   ├── ClaimList.tsx
│   │   │   ├── ClaimStatusBadge.tsx
│   │   │   └── ClaimReview.tsx
│   │   ├── admin/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── StaffList.tsx
│   │   │   ├── StaffForm.tsx
│   │   │   ├── SettingsForm.tsx
│   │   │   └── FraudTierSelector.tsx
│   │   ├── platform/
│   │   │   ├── TenantList.tsx
│   │   │   ├── TenantForm.tsx
│   │   │   └── TenantCard.tsx
│   │   ├── forms/
│   │   │   ├── DynamicForm.tsx     # Renders from JSON schema
│   │   │   ├── FormField.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── SearchBar.tsx
│   │   └── charts/
│   │       ├── ClaimsChart.tsx
│   │       ├── RevenueChart.tsx
│   │       └── FraudScoreChart.tsx
│   ├── lib/
│   │   ├── api-client.ts           # Typed API client
│   │   ├── auth.ts                  # Authentication helpers
│   │   ├── tenant.ts                # Tenant resolution
│   │   ├── utils.ts                 # Utility functions
│   │   └── constants.ts             # App constants
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTenant.ts
│   │   ├── useClaims.ts
│   │   ├── usePolicies.ts
│   │   ├── useFarmers.ts
│   │   ├── useNotifications.ts
│   │   └── useFraud.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── tenantStore.ts
│   │   ├── notificationStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── index.ts                 # All TypeScript types
│   │   ├── user.ts
│   │   ├── farmer.ts
│   │   ├── policy.ts
│   │   ├── claim.ts
│   │   ├── tenant.ts
│   │   ├── fraud.ts
│   │   └── billing.ts
│   └── config/
│       ├── site.ts                  # Site config
│       ├── navigation.ts            # Navigation items
│       └── roles.ts                 # Role-based access
├── public/
│   ├── images/
│   └── icons/
├── .env.local
├── tailwind.config.js
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 4. Pages & Routes

### Public Routes (No Auth Required)

| Path | Page | Description |
|------|------|-------------|
| `/` | Landing | Homepage with features and call to action |
| `/login` | Login | Sign in with Supabase |
| `/register` | Register | Create new account (farmer or staff) |
| `/forgot-password` | Forgot Password | Password reset |
| `/reset-password` | Reset Password | Set new password |
| `/health` | Health | API health check (optional) |

### Farmer Routes (FARMER role)

| Path | Page | Description |
|------|------|-------------|
| `/dashboard` | Farmer Dashboard | Overview: policies, claims, notifications |
| `/farmers/profile` | My Profile | View/edit farmer profile |
| `/farmers/parcels` | My Land Parcels | List and manage land parcels |
| `/farmers/parcels/create` | Add Parcel | Register new land parcel with GPS |
| `/policies` | My Policies | List all purchased policies |
| `/policies/purchase` | Purchase Policy | Browse plans and purchase |
| `/policies/:id` | Policy Detail | View policy details |
| `/claims` | My Claims | List all claims |
| `/claims/create` | Submit Claim | File new claim with documents |
| `/claims/:id` | Claim Detail | View claim status and details |
| `/notifications` | Notifications | In-app notification center |
| `/profile` | Profile | User account settings |

### Staff Routes (CLAIMS_OFFICER, UNDERWRITER, TENANT_ADMIN)

| Path | Page | Description |
|------|------|-------------|
| `/admin/dashboard` | Staff Dashboard | Overview with stats |
| `/admin/farmers` | Manage Farmers | List all farmers (tenant-scoped) |
| `/admin/farmers/:id` | Farmer Detail | View/edit farmer |
| `/admin/policies` | Manage Policies | List all policies |
| `/admin/policies/:id` | Policy Detail | View policy details |
| `/admin/claims` | Manage Claims | List all claims |
| `/admin/claims/:id` | Claim Review | Review claim with fraud data |
| `/admin/claims/:id/assign` | Assign Claim | Assign to claims officer |
| `/admin/documents` | Manage Documents | List all documents |
| `/admin/import` | Bulk Import | Import CSV/JSON data |

### Tenant Admin Routes (TENANT_ADMIN only)

| Path | Page | Description |
|------|------|-------------|
| `/admin/staff` | Manage Staff | List/create staff users |
| `/admin/staff/create` | Create Staff | Add new staff member |
| `/admin/staff/:id` | Staff Detail | Edit staff details |
| `/admin/settings` | Settings | Tenant configuration |
| `/admin/settings/fields` | Custom Fields | Manage dynamic farmer fields |
| `/admin/settings/fraud` | Fraud Settings | Configure fraud tier |
| `/admin/settings/iam` | IAM | Manage custom roles |
| `/admin/settings/payment` | Payment Gateway | Configure payment gateway |
| `/admin/billing` | Billing | Subscription and invoices |
| `/admin/billing/invoices` | Invoices | List all invoices |
| `/admin/billing/invoices/:id` | Invoice Detail | View invoice with line items |
| `/admin/analytics` | Analytics | Claims and revenue analytics |

### Platform Admin Routes (PLATFORM_ADMIN only)

| Path | Page | Description |
|------|------|-------------|
| `/platform/tenants` | Manage Tenants | List all tenants |
| `/platform/tenants/create` | Create Tenant | Onboard new insurance company |
| `/platform/tenants/:id` | Tenant Detail | View/edit tenant |
| `/platform/analytics` | Platform Analytics | Cross-tenant analytics |
| `/platform/users` | Platform Users | Manage platform users |

---

## 5. Authentication Flow

### Supabase Auth + NextAuth.js

```typescript
// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import SupabaseProvider from 'next-auth/providers/supabase';

export const authOptions = {
  providers: [
    SupabaseProvider({
      clientId: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      clientSecret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user data to session
      const user = await getLocalUser(token.sub!);
      session.user = {
        ...session.user,
        id: user.id,
        tenantId: user.tenantId,
        role: user.role,
        farmerId: user.farmerId,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Protected Route HOC

```typescript
// src/lib/auth.ts

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withAuth(
  Component: React.ComponentType,
  requiredRoles?: string[]
) {
  return function AuthenticatedComponent(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      // Check roles
      if (requiredRoles && session?.user) {
        const userRole = session.user.role;
        if (!requiredRoles.includes(userRole)) {
          router.push('/dashboard');
        }
      }
    }, [status, session, router]);

    if (status === 'loading') {
      return <LoadingSpinner />;
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Usage
export default withAuth(FarmerList, ['TENANT_ADMIN', 'CLAIMS_OFFICER']);
```

---

## 6. API Integration

### Typed API Client

```typescript
// src/lib/api-client.ts

import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  
  // Add tenant header
  const tenant = getTenantFromSubdomain();
  if (tenant) {
    config.headers['x-tenant-slug'] = tenant;
  }
  
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// === API METHODS ===

// Auth
export const authApi = {
  getMe: () => apiClient.get('/api/v1/auth/me'),
  updateProfile: (data: any) => apiClient.patch('/api/v1/auth/profile', data),
};

// Farmers
export const farmerApi = {
  getProfile: () => apiClient.get('/api/v1/farmers/profile'),
  createProfile: (data: any) => apiClient.post('/api/v1/farmers/profile', data),
  updateProfile: (data: any) => apiClient.patch('/api/v1/farmers/profile', data),
  getFields: () => apiClient.get('/api/v1/farmers/fields'),
};

// Land Parcels
export const landParcelApi = {
  list: (params?: any) => apiClient.get('/api/v1/land-parcels', { params }),
  get: (id: string) => apiClient.get(`/api/v1/land-parcels/${id}`),
  create: (data: any) => apiClient.post('/api/v1/land-parcels', data),
  update: (id: string, data: any) => apiClient.patch(`/api/v1/land-parcels/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/land-parcels/${id}`),
};

// Policy Plans
export const policyPlanApi = {
  list: (params?: any) => apiClient.get('/api/v1/policy-plans', { params }),
  get: (id: string) => apiClient.get(`/api/v1/policy-plans/${id}`),
  create: (data: any) => apiClient.post('/api/v1/policy-plans', data),
  update: (id: string, data: any) => apiClient.patch(`/api/v1/policy-plans/${id}`, data),
  quote: (data: any) => apiClient.post('/api/v1/policy-plans/quote', data),
};

// Policies
export const policyApi = {
  list: (params?: any) => apiClient.get('/api/v1/policies', { params }),
  get: (id: string) => apiClient.get(`/api/v1/policies/${id}`),
  purchase: (data: any) => apiClient.post('/api/v1/policies/purchase', data),
};

// Claims
export const claimApi = {
  list: (params?: any) => apiClient.get('/api/v1/claims', { params }),
  get: (id: string) => apiClient.get(`/api/v1/claims/${id}`),
  create: (data: any) => apiClient.post('/api/v1/claims', data),
  updateStatus: (id: string, data: any) => 
    apiClient.patch(`/api/v1/claims/${id}/status`, data),
  assign: (id: string, data: any) => 
    apiClient.patch(`/api/v1/claims/${id}/assign`, data),
  listAll: (params?: any) => apiClient.get('/api/v1/claims/admin/all', { params }),
};

// Documents
export const documentApi = {
  upload: (formData: FormData) => 
    apiClient.post('/api/v1/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: (claimId: string) => apiClient.get(`/api/v1/documents/claim/${claimId}`),
  get: (id: string) => apiClient.get(`/api/v1/documents/${id}`),
  delete: (id: string) => apiClient.delete(`/api/v1/documents/${id}`),
};

// Notifications
export const notificationApi = {
  list: (params?: any) => apiClient.get('/api/v1/notifications', { params }),
  markRead: (data: any) => apiClient.patch('/api/v1/notifications/read', data),
  markAllRead: () => apiClient.patch('/api/v1/notifications/read-all'),
};

// Admin
export const adminApi = {
  getDashboard: () => apiClient.get('/api/v1/admin/dashboard'),
  getAnalytics: (params?: any) => apiClient.get('/api/v1/admin/analytics/claims', { params }),
  listStaff: (params?: any) => apiClient.get('/api/v1/admin/staff', { params }),
  createStaff: (data: any) => apiClient.post('/api/v1/admin/staff', data),
  toggleStaff: (id: string) => 
    apiClient.patch(`/api/v1/admin/staff/${id}/toggle-status`),
};

// Platform
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
};

// Settings
export const settingsApi = {
  getSettings: () => apiClient.get('/api/v1/settings'),
  updateSettings: (data: any) => apiClient.patch('/api/v1/settings', data),
  getFraudTier: () => apiClient.get('/api/v1/settings/fraud-tier'),
  updateFraudTier: (data: any) => apiClient.patch('/api/v1/settings/fraud-tier', data),
  getPaymentGateway: () => apiClient.get('/api/v1/settings/payment-gateway'),
  updatePaymentGateway: (data: any) => 
    apiClient.patch('/api/v1/settings/payment-gateway', data),
};

// Tenant Fields
export const tenantFieldApi = {
  list: () => apiClient.get('/api/v1/settings/fields'),
  get: (id: string) => apiClient.get(`/api/v1/settings/fields/${id}`),
  create: (data: any) => apiClient.post('/api/v1/settings/fields', data),
  update: (id: string, data: any) => 
    apiClient.patch(`/api/v1/settings/fields/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/settings/fields/${id}`),
};

// IAM
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

// Billing
export const billingApi = {
  subscribe: () => apiClient.post('/api/v1/billing/subscribe'),
  cancel: () => apiClient.post('/api/v1/billing/cancel'),
  getStatus: () => apiClient.get('/api/v1/billing/status'),
  getUsage: () => apiClient.get('/api/v1/billing/usage'),
  listInvoices: (params?: any) => apiClient.get('/api/v1/billing/invoices', { params }),
  getInvoice: (id: string) => apiClient.get(`/api/v1/billing/invoices/${id}`),
  payInvoice: (id: string) => apiClient.post(`/api/v1/billing/invoices/${id}/pay`),
  generateInvoice: () => apiClient.post('/api/v1/billing/invoices/generate'),
};

// Import
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

export default apiClient;
```

---

## 7. State Management

### Zustand Stores

#### Auth Store

```typescript
// src/stores/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  farmerId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        // Check built-in role permissions
        // Check custom role permissions
        return true; // Implement actual permission check
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### Notification Store

```typescript
// src/stores/notificationStore.ts

import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: state.unreadCount - 1,
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));
```

---

## 8. UI Components

### Dynamic Form Component

```typescript
// src/components/forms/DynamicForm.tsx

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FieldConfig {
  fieldKey: string;
  label: string;
  fieldType: 'text' | 'number' | 'select' | 'date' | 'file';
  options?: string[];
  required: boolean;
}

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
  defaultValues?: any;
  submitLabel?: string;
}

export function DynamicForm({
  fields,
  onSubmit,
  defaultValues = {},
  submitLabel = 'Submit',
}: DynamicFormProps) {
  // Build Zod schema dynamically
  const schema = z.object(
    fields.reduce((acc, field) => {
      let validator: any = z.string();
      if (field.fieldType === 'number') {
        validator = z.number();
      }
      if (field.required) {
        validator = validator.min(1, `${field.label} is required`);
      } else {
        validator = validator.optional();
      }
      acc[field.fieldKey] = validator;
      return acc;
    }, {} as any)
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <div key={field.fieldKey}>
          <Label htmlFor={field.fieldKey}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          <Controller
            name={field.fieldKey}
            control={control}
            render={({ field: controllerField }) => {
              if (field.fieldType === 'select') {
                return (
                  <Select
                    {...controllerField}
                    onValueChange={controllerField.onChange}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder={`Select ${field.label}`} />
                    </Select.Trigger>
                    <Select.Content>
                      {field.options?.map((option) => (
                        <Select.Item key={option} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                );
              }
              
              return (
                <Input
                  {...controllerField}
                  type={field.fieldType === 'number' ? 'number' : 'text'}
                  placeholder={`Enter ${field.label}`}
                />
              );
            }}
          />
          
          {errors[field.fieldKey] && (
            <p className="text-sm text-red-500 mt-1">
              {errors[field.fieldKey]?.message as string}
            </p>
          )}
        </div>
      ))}
      
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
```

### File Upload Component

```typescript
// src/components/common/FileUpload.tsx

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onUpload,
  multiple = true,
  accept = 'image/*,video/*,.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept ? Object.fromEntries(
      accept.split(',').map((ext) => [ext, []])
    ) : undefined,
    maxSize,
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return File;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {accept} · Max {maxSize / 1024 / 1024}MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

## 9. Multi-Tenant Handling

### Tenant Resolution

```typescript
// src/lib/tenant.ts

export function getTenantFromSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if subdomain exists (e.g., acme.localhost:3000)
  if (parts.length > 2) {
    const subdomain = parts[0];
    // Ignore 'www' subdomain
    if (subdomain !== 'www') {
      return subdomain;
    }
  }
  
  return null;
}

export function getTenantFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  
  const path = window.location.pathname;
  const match = path.match(/^\/tenant\/([^/]+)/);
  return match ? match[1] : null;
}

export function getTenantSlug(): string | null {
  return getTenantFromSubdomain() || getTenantFromPath();
}
```

### Tenant Context Provider

```typescript
// src/app/providers/TenantProvider.tsx

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTenantSlug } from '@/lib/tenant';
import { useAuthStore } from '@/stores/authStore';

interface TenantContextType {
  tenantSlug: string | null;
  tenantId: string | null;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenantSlug: null,
  tenantId: null,
  isLoading: true,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const slug = getTenantSlug();
    setTenantSlug(slug);
    
    // If user is authenticated, use their tenantId
    if (user?.tenantId) {
      setTenantId(user.tenantId);
    }
    
    setIsLoading(false);
  }, [user]);

  return (
    <TenantContext.Provider value={{ tenantSlug, tenantId, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);
```

---

## 10. Dynamic Forms

### Fetching and Rendering Dynamic Fields

```typescript
// src/components/farmers/FarmerForm.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { farmerApi, tenantFieldApi } from '@/lib/api-client';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { useToast } from '@/hooks/use-toast';

interface FarmerFormProps {
  mode?: 'create' | 'edit';
  farmerId?: string;
  onSuccess?: () => void;
}

export function FarmerForm({ mode = 'create', farmerId, onSuccess }: FarmerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch tenant fields
  const { data: fieldsData } = useQuery({
    queryKey: ['tenantFields'],
    queryFn: () => tenantFieldApi.list(),
  });

  // Fetch farmer data if editing
  const { data: farmerData } = useQuery({
    queryKey: ['farmer', farmerId],
    queryFn: () => farmerApi.getProfile(),
    enabled: mode === 'edit' && !!farmerId,
  });

  const fields = fieldsData?.data || [];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await farmerApi.createProfile(data);
        toast({
          title: 'Success',
          description: 'Farmer profile created successfully',
        });
      } else {
        await farmerApi.updateProfile(data);
        toast({
          title: 'Success',
          description: 'Farmer profile updated successfully',
        });
      }
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build default values from farmer data
  const defaultValues = farmerData?.data || {};

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      submitLabel={mode === 'create' ? 'Create Farmer' : 'Update Farmer'}
    />
  );
}
```

---

## 11. Phase-by-Phase Implementation

### Phase 1: Foundation (Week 1)

| Task | Description | Priority |
|------|-------------|----------|
| Setup Next.js | Initialize project with TypeScript, Tailwind | High |
| Install shadcn/ui | Add component library | High |
| Configure Supabase Auth | NextAuth.js setup | High |
| API Client | Typed Axios client with interceptors | High |
| Tenant Resolution | Subdomain-based tenant detection | High |
| Layout | Dashboard layout with sidebar | High |
| Authentication Pages | Login, Register, Forgot Password | High |

### Phase 2: Farmer Portal (Week 2)

| Task | Description | Priority |
|------|-------------|----------|
| Dashboard | Farmer dashboard with stats | High |
| Farmer Profile | View/edit profile with dynamic fields | High |
| Land Parcels | CRUD with GPS map integration | High |
| Policy Plans | Browse and view plans | High |
| Policy Purchase | Buy policy with Stripe payment | High |
| My Policies | List and view policies | High |

### Phase 3: Claims (Week 3)

| Task | Description | Priority |
|------|-------------|----------|
| Submit Claim | Multi-file upload with dynamic form | High |
| My Claims | List and view claims | High |
| Claim Detail | Claim status, fraud score, documents | High |
| Claim Review | Staff review interface | High |
| Fraud Dashboard | Visualize fraud scores | Medium |
| Status Updates | Claim status tracking | High |

### Phase 4: Admin Features (Week 4)

| Task | Description | Priority |
|------|-------------|----------|
| Admin Dashboard | Analytics and stats | High |
| Manage Staff | Create, list, toggle staff | High |
| Settings | Tenant configuration | High |
| Custom Fields | Dynamic farmer field management | High |
| Fraud Settings | Configure fraud tier | High |
| IAM | Custom role management | High |

### Phase 5: Platform Admin (Week 5)

| Task | Description | Priority |
|------|-------------|----------|
| Tenant Management | Create, list, update tenants | High |
| Tenant Seeding | Seed policy plans | High |
| Platform Analytics | Cross-tenant analytics | Medium |
| Import | Bulk CSV/JSON upload UI | Medium |
| Billing | Subscription and invoices | Medium |

### Phase 6: Polish & Optimize (Week 6)

| Task | Description | Priority |
|------|-------------|----------|
| Notifications | In-app notification center | High |
| Responsive Design | Mobile-friendly views | High |
| Performance | Optimize bundle and queries | Medium |
| Accessibility | WCAG compliance | Medium |
| Testing | Unit and integration tests | High |
| Deployment | Vercel/Railway deployment | High |

---

## 12. Environment Variables

```env
# frontend/.env.local

# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary (for direct uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Google Maps (for location selection)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Feature Flags
NEXT_PUBLIC_BILLING_ENABLED=true
NEXT_PUBLIC_FRAUD_ENABLED=true
```

---

## 13. Deployment

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
# 4. Configure custom domain if needed
```

### Railway Deployment

```bash
# 1. Push code to GitHub
# 2. Connect to Railway
# 3. Set environment variables
# 4. Deploy
```

### Docker Deployment

```dockerfile
# frontend/Dockerfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📝 Summary

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 14+ with App Router |
| **Total Pages** | ~45 pages across 5 user roles |
| **API Integration** | Typed Axios client (58+ endpoints) |
| **State Management** | Zustand (global) + React Query (server state) |
| **UI Library** | shadcn/ui with Tailwind CSS |
| **Forms** | React Hook Form + Zod validation |
| **Authentication** | Supabase Auth + NextAuth.js |
| **Multi-Tenant** | Subdomain-based isolation |
| **Dynamic Forms** | Rendered from backend JSON config |
| **Deployment** | Vercel or Railway |

---

**Ready to start building the frontend?** 🚀f