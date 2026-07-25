'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api-client';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ClaimsChart } from '@/components/charts/ClaimsChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { FraudScoreChart } from '@/components/charts/FraudScoreChart';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const stats = data?.data || {};

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
