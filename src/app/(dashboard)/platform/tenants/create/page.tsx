'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantForm } from '@/components/platform/TenantForm';
import { withAuth } from '@/lib/auth';

function CreateTenantPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Tenant</h1>
        <p className="text-muted-foreground mt-1">
          Onboard a new insurance organization to the platform
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Details</CardTitle>
          <CardDescription>Enter the organization's information</CardDescription>
        </CardHeader>
        <CardContent>
          <TenantForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CreateTenantPage, ['PLATFORM_ADMIN']);
