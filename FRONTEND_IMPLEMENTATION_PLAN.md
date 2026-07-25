# 🎨 AIMS Frontend — Implementation Plan

> **Complete blueprint for building the Next.js frontend with Light Theme + Emerald Green + Pill-Style Design**

---

## 📌 Table of Contents

1. [Design System](#1-design-system)
2. [Project Setup](#2-project-setup)
3. [Phase 1: Foundation](#3-phase-1-foundation)
4. [Phase 2: Farmer Portal](#4-phase-2-farmer-portal)
5. [Phase 3: Claims](#5-phase-3-claims)
6. [Phase 4: Admin Features](#6-phase-4-admin-features)
7. [Phase 5: Platform Admin](#7-phase-5-platform-admin)
8. [Phase 6: Polish & Optimize](#8-phase-6-polish--optimize)
9. [Environment Variables](#9-environment-variables)
10. [Deployment](#10-deployment)

---

## 1. Design System

### Color Palette (Light Theme ONLY)

| Element | Color | Hex |
|---------|-------|-----|
| **Primary** | Dark Emerald Green | `#006B54` |
| **Primary Light** | Emerald Green | `#00876A` |
| **Primary Dark** | Deep Green | `#004D3C` |
| **Background** | White | `#FFFFFF` |
| **Background Light** | Off White | `#F8F9FA` |
| **Text Primary** | Black/Dark | `#1A1A1A` |
| **Text Secondary** | Gray | `#666666` |
| **Border** | Light Gray | `#E8ECEF` |
| **Success** | Green | `#22C55E` |
| **Warning** | Amber | `#F59E0B` |
| **Error** | Red | `#EF4444` |

### Design Tokens

| Element | Value |
|---------|-------|
| **Button Border Radius** | 50% (Full Pill Style) |
| **Input Border Radius** | 50% (Full Pill Style) |
| **Badge Border Radius** | 50% (Full Pill Style) |
| **Card Border Radius** | 16px |
| **Font** | Inter / Geist Sans |
| **Shadows** | 0 4px 20px rgba(0,0,0,0.05) |

---

## 2. Project Setup

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
```

### Step 2: Install Dependencies

```bash
# Core
npm install next@14 react@18 react-dom@18

# Auth
npm install next-auth@4 @supabase/supabase-js@2

# HTTP Client
npm install axios@1

# State Management
npm install zustand@4

# Data Fetching
npm install @tanstack/react-query@5

# Forms
npm install react-hook-form@7 @hookform/resolvers@3 zod@3

# UI
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# File Upload
npm install react-dropzone@14

# Charts
npm install recharts@2

# Notifications
npm install react-hot-toast@2

# shadcn/ui
npx shadcn-ui@latest init
```

### Step 3: Configure Tailwind for Pill Styles

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Pill-style buttons */
  .btn-pill {
    border-radius: 9999px !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
  
  /* Pill-style inputs */
  .input-pill {
    border-radius: 9999px !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  /* Pill-style badges */
  .badge-pill {
    border-radius: 9999px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}

@layer components {
  .btn-primary {
    @apply bg-[#006B54] text-white hover:bg-[#004D3C] btn-pill;
  }
  
  .btn-outline {
    @apply border-2 border-[#006B54] text-[#006B54] hover:bg-[#006B54] hover:text-white btn-pill;
  }
  
  .input-primary {
    @apply border border-[#E8ECEF] focus:border-[#006B54] focus:ring-2 focus:ring-[#006B54]/20 input-pill;
  }
  
  .card-primary {
    @apply bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)];
  }
}
```

---

## 3. Phase 1: Foundation

### Week 1 Tasks

| Task | Files | Description |
|------|-------|-------------|
| **Project Setup** | `package.json`, `tsconfig.json`, `tailwind.config.js` | Initialize Next.js with TypeScript + Tailwind |
| **shadcn/ui Setup** | `components/ui/*` | Install shadcn components with pill overrides |
| **Authentication** | `app/api/auth/[...nextauth]/route.ts` | NextAuth.js with Supabase provider |
| **Auth Pages** | `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx` | Login and Register pages |
| **API Client** | `lib/api-client.ts` | Typed Axios client with interceptors |
| **Tenant Resolution** | `lib/tenant.ts` | Subdomain-based tenant detection |
| **Layout** | `components/layout/Sidebar.tsx`, `components/layout/Header.tsx` | Dashboard layout with sidebar |
| **Auth Store** | `stores/authStore.ts` | Zustand store for auth state |

### Key Files to Create

#### 1. `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

#### 2. `src/lib/tenant.ts`
```typescript
export function getTenantFromSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }
  return null;
}

export function getTenantSlug(): string | null {
  return getTenantFromSubdomain();
}
```

#### 3. `src/app/api/auth/[...nextauth]/route.ts`
```typescript
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
      session.user = {
        ...session.user,
        id: token.id as string,
        tenantId: token.tenantId as string,
        role: token.role as string,
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

#### 4. `src/lib/api-client.ts`
Already provided in the comprehensive plan.

### ✅ Phase 1 Checkpoint

- [ ] Next.js project running (`npm run dev`)
- [ ] Authentication working (login/register)
- [ ] API client hitting backend
- [ ] Tenant headers being sent
- [ ] Dashboard layout with sidebar visible
- [ ] All colors: White background + Emerald Green (#006B54)

---

## 4. Phase 2: Farmer Portal

### Week 2 Tasks

| Task | Files | Description |
|------|-------|-------------|
| **Dashboard** | `app/(dashboard)/page.tsx` | Farmer dashboard with stats cards + charts |
| **Profile** | `app/(dashboard)/farmers/profile/page.tsx`, `components/farmers/FarmerForm.tsx` | View/edit farmer profile with dynamic fields |
| **Land Parcels** | `app/(dashboard)/farmers/parcels/page.tsx`, `components/farmers/ParcelForm.tsx` | CRUD with GPS map integration |
| **Policy Plans** | `app/(dashboard)/policies/page.tsx` | Browse and view plans |
| **Policy Purchase** | `app/(dashboard)/policies/purchase/page.tsx` | Buy policy with Stripe payment |
| **My Policies** | `app/(dashboard)/policies/page.tsx` | List and view purchased policies |

### Key Components to Build

#### 1. `components/forms/DynamicForm.tsx`
- Renders fields from backend JSON schema
- Supports: text, number, select, date, file
- Fully rounded inputs (pill style)

#### 2. `components/common/FileUpload.tsx`
- Drag-and-drop with react-dropzone
- Preview thumbnails
- File size validation (10MB max)

#### 3. `components/farmers/FarmerForm.tsx`
- Fetches tenant fields from backend
- Uses DynamicForm for rendering
- Handles create and edit modes

### ✅ Phase 2 Checkpoint

- [ ] Dashboard showing stats and charts
- [ ] Farmer profile with dynamic fields
- [ ] Land parcels CRUD working
- [ ] Policy plans listing
- [ ] Policy purchase flow
- [ ] All pages use Light Theme + Emerald Green

---

## 5. Phase 3: Claims

### Week 3 Tasks

| Task | Files | Description |
|------|-------|-------------|
| **Submit Claim** | `app/(dashboard)/claims/create/page.tsx`, `components/claims/ClaimForm.tsx` | Multi-file upload + dynamic form |
| **My Claims** | `app/(dashboard)/claims/page.tsx`, `components/claims/ClaimList.tsx` | List with status badges |
| **Claim Detail** | `app/(dashboard)/claims/[id]/page.tsx` | Claim status, fraud score, documents |
| **Claim Review** | `app/(dashboard)/claims/review/[id]/page.tsx`, `components/claims/ClaimReview.tsx` | Staff review interface |
| **Fraud Dashboard** | `app/(dashboard)/admin/fraud/page.tsx` | Visualize fraud scores |

### Key Components to Build

#### 1. `components/claims/ClaimForm.tsx`
- Step-by-step wizard (4 steps)
- Incident Details → Upload Documents → Review → Submit
- File upload with preview

#### 2. `components/claims/ClaimStatusBadge.tsx`
- Status: SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, PAID
- Color-coded pills (fully rounded)

#### 3. `components/charts/FraudScoreChart.tsx`
- Gauge for fraud score visualization
- Green → Yellow → Red gradient

### ✅ Phase 3 Checkpoint

- [ ] Claim submission with file upload
- [ ] My Claims list with filtering
- [ ] Claim detail with fraud score
- [ ] Staff review interface
- [ ] Fraud dashboard with charts
- [ ] Status badges in pill style

---

## 6. Phase 4: Admin Features

### Week 4 Tasks

| Task | Files | Description |
|------|-------|-------------|
| **Admin Dashboard** | `app/(dashboard)/admin/page.tsx` | Analytics and stats |
| **Manage Staff** | `app/(dashboard)/admin/staff/page.tsx`, `components/admin/StaffForm.tsx` | Create, list, toggle staff |
| **Settings** | `app/(dashboard)/admin/settings/page.tsx` | Tenant configuration |
| **Custom Fields** | `app/(dashboard)/admin/settings/fields/page.tsx` | Dynamic farmer field management |
| **Fraud Settings** | `app/(dashboard)/admin/settings/fraud/page.tsx` | Configure fraud tier |
| **IAM** | `app/(dashboard)/admin/settings/iam/page.tsx` | Custom role management |

### ⚠️ IMPORTANT: Light Theme ONLY

All admin pages **MUST** use:
- White background (#FFFFFF)
- Dark text (#1A1A1A)
- Emerald Green (#006B54) for primary elements
- **NO DARK MODE**

### Key Components to Build

#### 1. `components/admin/DashboardStats.tsx`
- 4-column stats cards
- Icons + numbers + trends

#### 2. `components/admin/StaffList.tsx`
- Table with staff info
- Status toggle switch
- Role badges (fully rounded pills)

#### 3. `components/admin/FraudTierSelector.tsx`
- 3-tier selector: FORGE, TITAN, GOAT
- Feature comparison
- Price display

### ✅ Phase 4 Checkpoint

- [ ] Admin dashboard with analytics
- [ ] Staff management working
- [ ] Settings pages functional
- [ ] Custom fields CRUD
- [ ] Fraud tier configuration
- [ ] IAM role management
- [ ] ALL pages in LIGHT THEME

---

## 7. Phase 5: Platform Admin

### Week 5 Tasks

| Task | Files | Description |
|------|-------|-------------|
| **Tenant Management** | `app/(dashboard)/platform/tenants/page.tsx`, `components/platform/TenantForm.tsx` | Create, list, update tenants |
| **Tenant Seeding** | `app/(dashboard)/platform/tenants/[id]/seed/page.tsx` | Seed policy plans |
| **Platform Analytics** | `app/(dashboard)/platform/analytics/page.tsx` | Cross-tenant analytics |
| **Import** | `app/(dashboard)/admin/import/page.tsx` | Bulk CSV/JSON upload UI |
| **Billing** | `app/(dashboard)/admin/billing/page.tsx` | Subscription and invoices |

### Key Components to Build

#### 1. `components/platform/TenantList.tsx`
- Table with tenant status
- Status: PENDING_APPROVAL (yellow), ACTIVE (green), SUSPENDED (red)
- Actions: Approve, Suspend, View

#### 2. `components/admin/ImportForm.tsx`
- Drag-and-drop upload
- CSV/JSON support
- Progress tracking

#### 3. `components/admin/BillingOverview.tsx`
- Subscription status
- Usage stats
- Invoice list

### ✅ Phase 5 Checkpoint

- [ ] Tenant management working
- [ ] Tenant seeding
- [ ] Platform analytics
- [ ] Bulk import functional
- [ ] Billing pages
- [ ] All pages in LIGHT THEME

---

## 8. Phase 6: Polish & Optimize

### Week 6 Tasks

| Task | Description |
|------|-------------|
| **Notifications** | In-app notification center with real-time updates |
| **Responsive Design** | Mobile-first, tablet, desktop |
| **Performance** | Optimize bundle size, image optimization |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Testing** | Unit + integration tests |
| **Deployment** | Vercel or Railway deployment |

### Key Components to Build

#### 1. `components/common/NotificationCenter.tsx`
- List of notifications
- Mark as read
- Real-time updates

#### 2. `components/common/LoadingSpinner.tsx`
- Emerald green spinner
- Full-page or inline

#### 3. `components/common/ErrorBoundary.tsx`
- Error fallback UI
- Retry mechanism

### ✅ Phase 6 Checkpoint

- [ ] Notifications center
- [ ] Mobile responsive
- [ ] Fast load times
- [ ] Accessibility passes
- [ ] Tests passing
- [ ] Deployed live

---

## 9. Environment Variables

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

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Feature Flags
NEXT_PUBLIC_BILLING_ENABLED=true
NEXT_PUBLIC_FRAUD_ENABLED=true
```

---

## 10. Deployment

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variables in Vercel dashboard
# 4. Configure custom domain if needed
```

### Railway Deployment

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect to Railway
# 3. Set environment variables
# 4. Deploy
```

---

## 📊 Page Count Summary

| Phase | Pages | Description |
|-------|-------|-------------|
| **Phase 1** | 5 | Auth pages + Layout |
| **Phase 2** | 8 | Farmer portal |
| **Phase 3** | 5 | Claims |
| **Phase 4** | 8 | Admin features |
| **Phase 5** | 6 | Platform admin |
| **Phase 6** | 3 | Polish pages |
| **Total** | **~35 pages** | |

---

## 🎯 Key Non-Negotiables

| Element | Requirement |
|---------|-------------|
| **Background** | White (#FFFFFF) on ALL pages |
| **Text** | Dark (#1A1A1A) |
| **Primary Color** | Emerald Green (#006B54) |
| **Buttons** | Fully rounded (Pill style - 50%) |
| **Inputs** | Fully rounded (Pill style - 50%) |
| **Badges** | Fully rounded (Pill style - 50%) |
| **Theme** | LIGHT THEME ONLY — NO DARK MODE |
| **Phase 4** | Admin pages ALSO use Light Theme |

---

## 📝 Quick Start Commands

```bash
# 1. Clone your existing frontend or create new
npx create-next-app@latest frontend --typescript --tailwind --app

# 2. Install dependencies
npm install next-auth @supabase/supabase-js axios zustand @tanstack/react-query react-hook-form @hookform/resolvers zod react-hot-toast react-dropzone recharts lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# 3. Setup shadcn/ui
npx shadcn-ui@latest init

# 4. Create .env.local with your variables

# 5. Start development
npm run dev
```

---

## 🚀 Next Steps

1. **Save this plan** as `FRONTEND_PLAN.md` in your project root
2. **Start Phase 1** — Project setup + Authentication
3. **Complete each phase** sequentially
4. **Test thoroughly** after each phase
5. **Deploy** when all phases complete

---

**Ready to start building the AIMS frontend!** 🎨🚀