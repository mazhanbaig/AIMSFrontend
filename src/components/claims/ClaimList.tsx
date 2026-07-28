'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClaims } from '@/hooks/useClaims';
import { ClaimCard } from './ClaimCard';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Filter } from 'lucide-react';

interface ClaimListProps {
  showActions?: boolean;
  isAdmin?: boolean;
}

export function ClaimList({ showActions = false, isAdmin = false }: ClaimListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  const params: any = { search, page, limit };
  if (status !== 'ALL') params.status = status;

  const { data, isLoading } = useClaims(isAdmin ? params : undefined);
  const claims = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading claims..." />;
  }

  const getDetailPath = (claimId: string) =>
    isAdmin ? `/admin/claims/${claimId}` : `/claims/${claimId}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-md">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search claims..."
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="INVESTIGATION">Investigation</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showActions && (
            <Button onClick={() => router.push('/claims/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Submit Claim
            </Button>
          )}
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No claims found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {claims.map((claim: any) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onClick={() => router.push(getDetailPath(claim.id))}
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
