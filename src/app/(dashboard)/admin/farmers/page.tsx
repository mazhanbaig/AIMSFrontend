'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFarmers } from '@/hooks/useFarmers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/common/SearchBar';
import { formatDate } from '@/lib/utils';
import { Users, MapPin, Phone } from 'lucide-react';
import { withAuth } from '@/lib/auth';

function AdminFarmersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useFarmers({ search, page, limit: 12 });
  const farmers = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading farmers..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Farmers</h1>
        <p className="text-muted-foreground mt-1">View and manage farmer accounts</p>
      </div>

      <div className="max-w-md">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search farmers..." />
      </div>

      {farmers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No farmers found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {farmers.map((farmer: any) => (
            <Card
              key={farmer.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/farmers/${farmer.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{farmer.name}</CardTitle>
                  <Badge variant={farmer.isVerified ? 'success' : 'secondary'}>
                    {farmer.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{farmer.phone}</span>
                </div>
                {farmer.city && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{farmer.city}{farmer.state ? `, ${farmer.state}` : ''}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-1">Joined {formatDate(farmer.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
    </div>
  );
}

export default withAuth(AdminFarmersPage, ['CLAIMS_OFFICER', 'TENANT_ADMIN']);
