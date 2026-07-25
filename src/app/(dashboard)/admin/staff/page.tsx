'use client';

import { StaffList } from '@/components/admin/StaffList';
import { withAuth } from '@/lib/auth';

function StaffManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your team members and their access
        </p>
      </div>
      <StaffList />
    </div>
  );
}

export default withAuth(StaffManagementPage, ['TENANT_ADMIN']);
