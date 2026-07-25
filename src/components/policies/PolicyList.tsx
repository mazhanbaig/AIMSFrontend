'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePolicies } from '@/hooks/usePolicies';
import { PolicyCard } from './PolicyCard';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PolicyListProps {
  showActions?: boolean;
}

export function PolicyList({ showActions = false }: PolicyListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = usePolicies({ search, page, limit });
  const policies = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading policies..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load policies. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search policies..."
          />
        </div>
        {showActions && (
          <Button onClick={() => router.push('/policies/purchase')}>
            <Plus className="mr-2 h-4 w-4" />
            Purchase Policy
          </Button>
        )}
      </div>

      {policies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No policies found</p>
          <p className="text-sm mt-1">
            {showActions ? 'Browse available plans and purchase your first policy' : ''}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy: any) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onClick={() => router.push(`/policies/${policy.id}`)}
            />
          ))}
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
