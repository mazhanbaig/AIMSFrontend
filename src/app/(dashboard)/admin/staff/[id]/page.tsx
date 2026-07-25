'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { UserCog, Mail, Phone, Calendar, Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/auth';

function StaffDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => adminApi.getStaff(id),
  });

  const staff = data?.data;

  if (isLoading) return <LoadingSpinner size="lg" text="Loading staff member..." />;
  if (!staff) return <div className="text-center py-12 text-destructive">Staff member not found</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{staff.name || 'Staff Member'}</h1>
          <p className="text-muted-foreground mt-1">Staff Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Staff Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{staff.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-1"><Mail className="h-3 w-3" />{staff.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium flex items-center gap-1"><Phone className="h-3 w-3" />{staff.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                <Shield className="h-3 w-3" />
                {staff.role?.replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={staff.isActive !== false ? 'success' : 'destructive'}>
                {staff.isActive !== false ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(staff.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(StaffDetailPage, ['TENANT_ADMIN']);
