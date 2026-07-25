'use client';

import { PolicyList } from '@/components/policies/PolicyList';

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Policies</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your insurance policies
        </p>
      </div>
      <PolicyList showActions />
    </div>
  );
}
