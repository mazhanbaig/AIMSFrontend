# AIMS Frontend

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** NextAuth.js (credentials, Google, GitHub, dev mode)
- **State:** Zustand (client), TanStack Query (server)
- **UI:** shadcn/ui + Tailwind CSS
- **HTTP:** Axios

## Getting Started

```bash
npm install
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL
npm run dev
```

## Project Structure

```
src/
  app/                   — Next.js App Router pages
    (auth)/              — login, register, oauth/setup, dev-login
    (dashboard)/         — 30+ protected pages
  components/
    ui/                  — shadcn primitives (button, card, dialog, etc.)
    common/              — SearchBar, Pagination, LoadingSpinner, ErrorBoundary
    layout/              — Sidebar, Header
    forms/               — FileUpload, DynamicForm
    claims/              — ClaimList, ClaimForm, ClaimCard, ClaimReview
    policies/            — PolicyList, PolicyForm, PolicyCard
    farmers/             — FarmerList, FarmerForm, FarmerCard
    admin/               — StaffList, StaffForm, SettingsForm, FraudTierSelector
    platform/            — TenantList, TenantForm, TenantCard
    charts/              — RevenueChart, FraudScoreChart, ClaimsChart
  hooks/                 — React Query hooks (useClaims, useFarmers, usePolicies, etc.)
  stores/                — Zustand stores (authStore, uiStore, tenantStore, notificationStore)
  config/                — auth-options, navigation, roles, site config
  lib/                   — api-client (Axios), tenant, utils
  types/                 — TypeScript interfaces
```

## Auth Flow
1. Login via credentials → backend `/api/v1/auth/login` → JWT token
2. Token stored in NextAuth JWT (encrypted cookie)
3. Axios interceptor adds `Authorization: Bearer <token>` and `x-tenant-slug` headers
4. Session synced to Zustand `authStore` via `useAuth` hook

## Key Conventions
- All API calls go through `src/lib/api-client.ts` (Axios instance)
- List hooks normalize backend paginated responses to `{ data, pagination }`
- Pages check `error` from useQuery for graceful failure states
- Role-based UI via `withAuth()` HOC and navigation config
