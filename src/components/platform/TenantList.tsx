'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { platformApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/common/SearchBar';
import { formatDate } from '@/lib/utils';
import { Plus, Building2, Users, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TenantList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['tenants', search, page],
    queryFn: async () => {
      const response = await platformApi.listTenants({ search, page, limit: 10 });
      const body = response.data;
      return { data: body.items || body.data, pagination: body.pagination };
    },
  });

  const tenants = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading tenants..." />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive">Failed to load tenants</p>
        <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tenants..." />
        </div>
        <Button onClick={() => router.push('/platform/tenants/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Tenant
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant: any) => (
          <Card
            key={tenant.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/platform/tenants/${tenant.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{tenant.name}</CardTitle>
                </div>
                <Badge variant={tenant.isActive ? 'success' : 'secondary'}>
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground font-mono">{tenant.slug}</p>
                {tenant.domain && (
                  <p className="text-muted-foreground">{tenant.domain}</p>
                )}
                {tenant.subscriptionTier && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <CreditCard className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{tenant.subscriptionTier}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Users className="h-3 w-3" />
                  <span>Created {formatDate(tenant.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tenants.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No tenants found</p>
          <p className="text-sm mt-1">Create your first tenant to get started</p>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
