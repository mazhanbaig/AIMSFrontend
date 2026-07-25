'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StaffForm } from '@/components/admin/StaffForm';
import { withAuth } from '@/lib/auth';

function CreateStaffPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Staff Member</h1>
        <p className="text-muted-foreground mt-1">
          Create a new staff account with role-based access
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
          <CardDescription>Enter the staff member's information</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CreateStaffPage, ['TENANT_ADMIN']);
