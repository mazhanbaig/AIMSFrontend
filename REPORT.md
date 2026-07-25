# AIMS Frontend — Project Report

## Project Overview

The **Agricultural Insurance Management System (AIMS)** frontend is a comprehensive Next.js 14+ application that connects to the AIMS backend REST API. It provides complete interfaces for farmers, insurance staff, tenant admins, and platform admins to manage agricultural insurance policies, claims, fraud detection, and multi-tenant operations.

### Key Features

- **Multi-tenant architecture** with subdomain-based isolation
- **Role-based access control** (Farmer, Claims Officer, Underwriter, Tenant Admin, Platform Admin)
- **Dynamic forms** rendered from backend JSON configuration
- **Fraud detection visualization** with risk scoring
- **File uploads** with drag-and-drop support
- **Interactive charts** for analytics and reporting
- **Responsive design** for mobile, tablet, and desktop

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 14.x | React framework with App Router |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| UI Components | shadcn/ui | Latest | Pre-built accessible components |
| State Management | Zustand | 4.x | Global state with persistence |
| Data Fetching | TanStack Query | 5.x | Server state management |
| Forms | React Hook Form | 7.x | Form handling |
| Validation | Zod | 3.x | Schema validation |
| HTTP Client | Axios | 1.x | API calls with interceptors |
| Authentication | NextAuth.js | 4.x | Auth with JWT sessions |
| File Upload | react-dropzone | 14.x | Drag-and-drop uploads |
| Charts | Recharts | 2.x | Dashboard visualizations |
| Notifications | react-hot-toast | 2.x | User notifications |

## Pages Built

### Authentication Pages
- `/login` — Sign in with email/password
- `/register` — Create account with role selection
- `/forgot-password` — Password reset request

### Farmer Portal
- `/dashboard` — Farmer dashboard with quick actions and stats
- `/profile` — User profile and account settings
- `/farmers/profile` — Farmer profile management
- `/policies` — List purchased policies
- `/policies/purchase` — Browse and purchase new policies
- `/policies/[id]` — Policy detail view
- `/claims` — List submitted claims
- `/claims/create` — Submit new claim with document uploads
- `/claims/[id]` — Claim detail with fraud score

### Staff Portal (Claims Officer, Underwriter, Tenant Admin)
- `/admin/dashboard` — Staff dashboard with analytics
- `/admin/claims` — Manage all claims
- `/admin/claims/[id]` — Claim review with fraud analysis
- `/admin/farmers` — Farmer management

### Tenant Admin Portal
- `/admin/staff` — Staff management with toggle
- `/admin/staff/create` — Create new staff member
- `/admin/settings` — Tenant configuration
- `/admin/settings/fields` — Custom dynamic fields
- `/admin/settings/fraud` — Fraud tier configuration
- `/admin/settings/iam` — IAM role management
- `/admin/billing` — Subscription and invoices

### Platform Admin Portal
- `/platform/tenants` — Tenant management
- `/platform/tenants/create` — Create new tenant
- `/platform/tenants/[id]` — Tenant detail with seed
- `/platform/analytics` — Cross-tenant analytics

### Common
- `/notifications` — In-app notification center
- `/profile` — User account settings

## API Integration

The frontend connects to the AIMS backend via a typed Axios client (`src/lib/api-client.ts`) containing **58+ endpoints** across 15 domain groups:

- **Auth** — login, register, profile management
- **Farmers** — profile CRUD, field management
- **Land Parcels** — CRUD with GPS coordinates
- **Policy Plans** — CRUD with quoting
- **Policies** — listing, detail, purchase
- **Claims** — CRUD, status updates, assignment, fraud analysis
- **Documents** — upload, list, delete
- **Notifications** — list, mark read
- **Admin** — dashboard, analytics, staff management
- **Platform** — tenant management, seeding
- **Settings** — tenant settings, fraud tier, payment gateway
- **Tenant Fields** — dynamic field management
- **IAM** — roles, permissions
- **Billing** — subscription, invoices, usage
- **Import** — bulk CSV/JSON import

### API Client Features
- Automatic **Bearer token** injection from NextAuth session
- **x-tenant-slug** header for multi-tenant isolation
- **401 response** handling with automatic redirect to login
- Typed error responses with status codes

## Authentication Flow

### Supabase Auth + NextAuth.js with JWT

1. **Login**: User submits credentials → NextAuth `authorize` callback validates against backend API → JWT token created
2. **Session**: JWT stored in cookie → Session callbacks enrich session with user role, tenantId, farmerId
3. **API Calls**: Request interceptor reads token from NextAuth session → Adds Bearer header
4. **Role Protection**: `withAuth` HOC wraps protected pages → Redirects unauthenticated users to login
5. **Logout**: Clears NextAuth session → Redirects to login page

## Multi-Tenant Handling

Tenant isolation is implemented through:

1. **Subdomain resolution**: `getTenantFromSubdomain()` extracts tenant slug from URL (e.g., `acme.yourapp.com` → `acme`)
2. **Path fallback**: `getTenantFromPath()` extracts from `/tenant/{slug}` path
3. **Header injection**: Every API request includes `x-tenant-slug` header
4. **Tenant context**: React context provides tenant info throughout the app
5. **Data isolation**: Backend enforces tenant-scoped queries

## Component Library

### UI Components (shadcn/ui)
- Button, Input, Label, Badge, Card, Avatar
- Select, Dialog, Dropdown Menu, Tabs, Separator
- Switch, Progress, Skeleton, Toast

### Layout Components
- `Sidebar` — Collapsible navigation with role-based menu items
- `Header` — User menu, notifications badge, responsive controls

### Form Components
- `DynamicForm` — Renders fields from JSON schema with Zod validation
- `FileUpload` — Drag-and-drop with preview and removal
- `FarmerForm` — Combines static + dynamic tenant fields
- `ClaimForm` — Multi-step claim submission with file uploads
- `StaffForm` — Staff creation/editing
- `TenantForm` — Tenant onboarding with branding
- `SettingsForm` — Tenant configuration management

### Claim Components
- `ClaimCard` — Claim display with fraud score progress bar
- `ClaimList` — Filterable, paginated claim grid
- `ClaimStatusBadge` — Color-coded status indicators
- `ClaimReview` — Full review interface with fraud analysis

### Admin Components
- `DashboardStats` — Metric cards with trend indicators
- `StaffList` — Staff management with toggle switch
- `FraudTierSelector` — Fraud threshold configuration

### Platform Components
- `TenantList` — Tenant grid with subscription info
- `TenantCard` — Tenant detail with actions

### Chart Components
- `ClaimsChart` — Bar chart for claims by status
- `RevenueChart` — Line chart for premium vs payout
- `FraudScoreChart` — Donut chart for fraud distribution

### Common Components
- `LoadingSpinner` — Configurable size with optional text
- `Pagination` — Page navigation with ellipsis
- `ErrorBoundary` — Error catching with retry
- `SearchBar` — Debounced search input

## State Management

Using **Zustand** with persistence middleware:

| Store | Key State | Purpose |
|-------|-----------|---------|
| `authStore` | user, isAuthenticated, hasRole | Persistent user session data |
| `notificationStore` | notifications, unreadCount | Real-time notification tracking |
| `uiStore` | sidebarOpen, theme, loadingStates | UI state management |
| `tenantStore` | currentTenant, isLoading | Current tenant context |

## Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAuth` | Authentication operations (login, register, logout) |
| `useTenant` | Tenant resolution and fetching |
| `useClaims` | Claim CRUD with TanStack Query mutations |
| `usePolicies` | Policy listing, detail, purchase, quoting |
| `useFarmers` | Farmer profile, land parcels, tenant fields |
| `useNotifications` | Notification polling and mark-read |
| `useFraud` | Fraud analysis, score colors, verdict labels |

## Phase Progress

### Phase 1: Foundation (✅ Complete)
- ✅ Project setup with Next.js 14+, TypeScript, Tailwind CSS
- ✅ shadcn/ui component library
- ✅ Type definitions for all entities
- ✅ Typed API client with 58+ endpoints
- ✅ NextAuth.js configuration with JWT
- ✅ Zustand stores with persistence
- ✅ Custom React hooks
- ✅ Multi-tenant resolution utilities
- ✅ Dashboard layout with sidebar and header

### Phase 2: Farmer Portal (✅ Complete)
- ✅ Farmer dashboard with quick actions
- ✅ Farmer profile with dynamic fields
- ✅ Land parcel management
- ✅ Policy listing and cards
- ✅ Policy purchase flow
- ✅ Policy plan browsing

### Phase 3: Claims (✅ Complete)
- ✅ Claim submission with document uploads
- ✅ Claim listing with filters
- ✅ Claim detail with status tracking
- ✅ Claim review interface for staff
- ✅ Fraud score visualization

### Phase 4: Admin Features (✅ Complete)
- ✅ Admin dashboard with analytics
- ✅ Staff management CRUD
- ✅ Tenant settings configuration
- ✅ Custom field management
- ✅ Fraud tier configuration
- ✅ IAM role structure

### Phase 5: Platform Admin (✅ Complete)
- ✅ Tenant management
- ✅ Tenant onboarding form
- ✅ Tenant detail with seeding
- ✅ Platform analytics
- ✅ Import UI structure

### Phase 6: Polish & Polish (✅ Complete)
- ✅ Notification center
- ✅ Responsive design
- ✅ Error boundaries
- ✅ Loading states
- ✅ Toast notifications

## Pending Tasks

- [ ] **Testing**: Add unit and integration tests
- [ ] **End-to-end testing**: Verify complete flows against live backend
- [ ] **Performance optimization**: Bundle analysis and lazy loading
- [ ] **Accessibility audit**: WCAG compliance review
- [ ] **i18n**: Internationalization support
- [ ] **Dark mode**: Toggle between light/dark themes
- [ ] **CI/CD**: GitHub Actions pipeline
- [ ] **Docker**: Containerization for deployment
- [ ] **Analytics**: Add page view tracking

## Deployment Instructions

### Vercel Deployment (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login and deploy
vercel login
vercel

# 3. Set environment variables in Vercel dashboard
# 4. Configure custom domain if needed
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
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

## Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Stripe (for payment gateway)
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

## File Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── page.tsx              # Dashboard home
│   │   ├── farmers/
│   │   ├── policies/
│   │   ├── claims/
│   │   ├── admin/
│   │   ├── platform/
│   │   ├── notifications/
│   │   └── profile/
│   ├── api/auth/[...nextauth]/
│   ├── providers/
│   ├── layout.tsx
│   └── globals.css
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Sidebar, Header
│   ├── farmers/                  # Farmer components
│   ├── policies/                 # Policy components
│   ├── claims/                   # Claim components
│   ├── admin/                    # Admin components
│   ├── platform/                 # Platform components
│   ├── forms/                    # DynamicForm, FileUpload
│   ├── common/                   # Shared components
│   └── charts/                   # Recharts visualizations
├── lib/                          # Utilities
│   ├── api-client.ts             # Typed API client
│   ├── auth.ts                   # Auth helpers
│   ├── tenant.ts                 # Tenant resolution
│   ├── utils.ts                  # Shared utilities
│   └── constants.ts              # App constants
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript type definitions
└── config/                       # Configuration
```

## Ready to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
