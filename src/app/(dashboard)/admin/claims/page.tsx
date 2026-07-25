'use client';

import { ClaimList } from '@/components/claims/ClaimList';

export default function AdminClaimsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Claims</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all insurance claims
        </p>
      </div>
      <ClaimList isAdmin />
    </div>
  );
}
