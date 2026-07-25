'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/api-client';
import { TenantCard } from '@/components/platform/TenantCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { withAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => platformApi.getTenant(id),
    enabled: !!id,
  });

  const seedMutation = useMutation({
    mutationFn: () => platformApi.seedTenant(id),
    onSuccess: () => {
      toast.success('Tenant seeded with sample data');
    },
    onError: () => toast.error('Failed to seed tenant'),
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading tenant details..." />;
  }

  const tenant = data?.data || data;

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive">Tenant not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/platform/tenants')}>
          Back to Tenants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/platform/tenants')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tenants
      </Button>

      <TenantCard
        tenant={tenant}
        onSeed={() => seedMutation.mutate()}
      />
    </div>
  );
}

export default withAuth(TenantDetailPage, ['PLATFORM_ADMIN']);
