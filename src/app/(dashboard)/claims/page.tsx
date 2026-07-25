'use client';

import { ClaimList } from '@/components/claims/ClaimList';

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Claims</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your insurance claims
        </p>
      </div>
      <ClaimList showActions />
    </div>
  );
}
