'use client';

import { TenantList } from '@/components/platform/TenantList';
import { withAuth } from '@/lib/auth';

function TenantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
        <p className="text-muted-foreground mt-1">
          Manage all tenant organizations on the platform
        </p>
      </div>
      <TenantList />
    </div>
  );
}

export default withAuth(TenantsPage, ['PLATFORM_ADMIN']);
