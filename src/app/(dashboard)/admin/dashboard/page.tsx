'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api-client';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ClaimsChart } from '@/components/charts/ClaimsChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { FraudScoreChart } from '@/components/charts/FraudScoreChart';

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await adminApi.getDashboard();
      return response.data;
    },
  });

  const stats = data?.data || {};

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-destructive">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your insurance operations
        </p>
      </div>

      <DashboardStats stats={stats} isLoading={isLoading} />

      <div className="grid gap-6 md:grid-cols-2">
        <ClaimsChart />
        <RevenueChart />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FraudScoreChart />
      </div>
    </div>
  );
}
