'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePolicyPlans } from '@/hooks/usePolicies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/common/SearchBar';
import { formatCurrency } from '@/lib/utils';
import { FileText, Shield, Clock } from 'lucide-react';
import { withAuth } from '@/lib/auth';

function AdminPoliciesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = usePolicyPlans({ search, page, limit: 12 });

  const plans = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading policies..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Policies</h1>
          <p className="text-muted-foreground mt-1">View and manage policy plans</p>
        </div>
      </div>

      <div className="max-w-md">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search policy plans..." />
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No policy plans found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan: any) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                  </div>
                  <Badge variant={plan.isActive ? 'success' : 'secondary'}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline" className="text-xs">{plan.type}</Badge>
                <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Premium</p>
                    <p className="font-medium">{formatCurrency(plan.premium, plan.premiumCurrency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Coverage</p>
                    <p className="font-medium">{formatCurrency(plan.maxCoverage, plan.premiumCurrency)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{plan.durationMonths} months</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
    </div>
  );
}

export default withAuth(AdminPoliciesPage, ['CLAIMS_OFFICER', 'UNDERWRITER', 'TENANT_ADMIN']);
