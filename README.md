# AIMS Frontend — Agricultural Insurance Management System

A comprehensive Next.js 14+ frontend application for managing agricultural insurance policies, claims, and fraud detection with multi-tenant support.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm or yarn
- AIMS backend API running (default: `http://localhost:4000`)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd aims-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Environment Variables

Copy `.env.local` and fill in your values:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

## 📖 Features

### For Farmers
- Register and manage your profile with custom fields
- Browse and purchase insurance policies
- Submit claims with document uploads
- Track claim status with fraud score visualization
- Manage land parcels

### For Staff (Claims Officers, Underwriters)
- Dashboard with analytics and charts
- Review and process claims
- View fraud analysis scores
- Manage farmers and policies

### For Tenant Admins
- Full admin dashboard with revenue analytics
- Manage staff members with role-based access
- Configure tenant settings
- Custom dynamic form fields for farmer profiles
- Fraud detection tier configuration
- IAM role management
- Subscription billing and invoices

### For Platform Admins
- Create and manage tenant organizations
- Seed tenants with sample data
- Cross-tenant analytics

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 3.x |
| UI Components | shadcn/ui |
| State Management | Zustand 4.x |
| Data Fetching | TanStack Query 5.x |
| Forms | React Hook Form + Zod |
| Authentication | NextAuth.js with JWT |
| HTTP Client | Axios |
| Charts | Recharts |
| Notifications | react-hot-toast |
| File Upload | react-dropzone |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login, Register, Forgot Password
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── farmers/       # Farmer profile
│   │   ├── policies/      # Policy listing, purchase, detail
│   │   ├── claims/        # Claims listing, creation, detail
│   │   ├── admin/         # Admin dashboard, staff, settings, billing
│   │   ├── platform/      # Tenant management, analytics
│   │   ├── notifications/ # Notification center
│   │   └── profile/       # User profile
│   ├── api/auth/          # NextAuth API route
│   └── providers/         # React providers
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Sidebar, Header
│   ├── farmers/          # Farmer components
│   ├── policies/         # Policy components
│   ├── claims/           # Claim components
│   ├── admin/            # Admin components
│   ├── platform/         # Platform components
│   ├── forms/            # DynamicForm, FileUpload
│   ├── common/           # Shared components
│   └── charts/           # Recharts visualizations
├── lib/                  # Utilities
│   ├── api-client.ts     # Typed API client (58+ endpoints)
│   ├── auth.tsx          # Auth helpers, withAuth HOC
│   ├── tenant.ts         # Tenant resolution
│   ├── utils.ts          # Shared utilities
│   └── constants.ts      # App constants
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript type definitions
└── config/               # App configuration
```

## 🔐 Authentication

The app uses NextAuth.js with a Credentials provider that authenticates against the AIMS backend API. JWT sessions store user role, tenantId, and other custom fields.

### Auth Flow
1. User submits email/password on `/login`
2. NextAuth `authorize` callback validates against `POST /api/v1/auth/login`
3. JWT contains user metadata (id, role, tenantId, farmerId)
4. Axios interceptor attaches Bearer token and `x-tenant-slug` header to every request
5. Protected routes use `withAuth()` HOC or session check in layout

## 🏢 Multi-Tenant

Tenant isolation is handled via:
- **Subdomain detection**: `acme.yourapp.com` → extracts `acme`
- **Slug header**: `x-tenant-slug` sent with every API request
- **TenantProvider**: React context for tenant info access throughout the app
- **Backend enforcement**: All data queries are tenant-scoped

## 🧩 API Client

The typed API client at `src/lib/api-client.ts` provides 58+ endpoints across these domains:

- Auth, Farmers, Land Parcels
- Policy Plans, Policies
- Claims, Documents, Notifications
- Admin Dashboard, Staff, Analytics
- Platform Tenants, Seeding
- Settings, Custom Fields
- IAM Roles, Permissions
- Billing, Invoices, Usage
- Import (CSV/JSON)

## 📊 Available Pages (24 total)

| Route | Page | Access |
|-------|------|--------|
| `/login` | Sign in | Public |
| `/register` | Create account | Public |
| `/forgot-password` | Password reset | Public |
| `/dashboard` | Farmer dashboard | Farmer |
| `/profile` | User profile | Authenticated |
| `/farmers/profile` | Farmer profile | Farmer |
| `/policies` | Policy list | Farmer |
| `/policies/purchase` | Buy policy | Farmer |
| `/policies/[id]` | Policy detail | Farmer |
| `/claims` | Claims list | Farmer |
| `/claims/create` | Submit claim | Farmer |
| `/claims/[id]` | Claim detail | Farmer |
| `/notifications` | Notifications | Authenticated |
| `/admin/dashboard` | Admin dashboard | Staff/Admin |
| `/admin/claims` | Manage claims | Staff/Admin |
| `/admin/claims/[id]` | Claim review | Staff/Admin |
| `/admin/staff` | Manage staff | Tenant Admin |
| `/admin/staff/create` | Add staff | Tenant Admin |
| `/admin/settings` | Tenant settings | Tenant Admin |
| `/admin/settings/fields` | Custom fields | Tenant Admin |
| `/admin/settings/iam` | IAM roles | Tenant Admin |
| `/admin/billing` | Billing | Tenant Admin |
| `/platform/tenants` | Tenants | Platform Admin |
| `/platform/tenants/create` | New tenant | Platform Admin |
| `/platform/tenants/[id]` | Tenant detail | Platform Admin |

## 🧪 Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```bash
docker build -t aims-frontend .
docker run -p 3000:3000 aims-frontend
```
