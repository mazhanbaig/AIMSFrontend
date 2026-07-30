'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { SearchBar } from '@/components/common/SearchBar';
import { getInitials } from '@/lib/utils';
import { Plus, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function StaffList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['staff', search, page],
    queryFn: async () => {
      const response = await adminApi.listStaff({ search, page, limit: 10 });
      const body = response.data;
      return { data: body.items || body.data, pagination: body.pagination };
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff status updated');
    },
    onError: () => toast.error('Failed to update staff status'),
  });

  const staff = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading staff..." />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive">Failed to load staff</p>
        <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." />
        </div>
        <Button onClick={() => router.push('/admin/staff/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No staff members found</p>
          ) : (
            <div className="space-y-3">
              {staff.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(member.name || member.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name || member.email}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {member.role?.replace('_', ' ')}
                        </Badge>
                        <Badge variant={member.isActive ? 'success' : 'secondary'} className="text-xs">
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={member.isActive}
                      onCheckedChange={() => toggleMutation.mutate(member.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/staff/${member.id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
