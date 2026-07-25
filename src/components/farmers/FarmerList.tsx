'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFarmers } from '@/hooks/useFarmers';
import { FarmerCard } from './FarmerCard';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function FarmerList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useFarmers({ search, page, limit });
  const farmers = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading farmers..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load farmers. Please try again.
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
            placeholder="Search farmers..."
          />
        </div>
        <Button onClick={() => router.push('/farmers/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Farmer
        </Button>
      </div>

      {farmers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No farmers found</p>
          <p className="text-sm mt-1">Try adjusting your search or add a new farmer</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {farmers.map((farmer: any) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              onClick={() => router.push(`/farmers/${farmer.id}`)}
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
