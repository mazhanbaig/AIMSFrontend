'use client';

import { useQuery } from '@tanstack/react-query';
import { platformApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BarChart3, Building2, Users, FileText, Shield, TrendingUp } from 'lucide-react';
import { withAuth } from '@/lib/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function PlatformAnalyticsPage() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['platform-analytics'],
    queryFn: () => platformApi.getPlatformAnalytics(),
  });

  const analytics = analyticsData?.data || {};

  if (isLoading) return <LoadingSpinner size="lg" text="Loading analytics..." />;

  const tenantData = [
    { name: 'Active', value: analytics.activeTenants || 0, fill: '#006B54' },
    { name: 'Inactive', value: (analytics.totalTenants || 0) - (analytics.activeTenants || 0), fill: '#94A3B8' },
  ];

  const claimsData = analytics.claimsByStatus
    ? Object.entries(analytics.claimsByStatus).map(([status, count]) => ({
        name: status.replace(/_/g, ' '),
        count: count as number,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Overview of platform-wide metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary opacity-80" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalTenants || 0}</p>
                <p className="text-sm text-muted-foreground">Total Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500 opacity-80" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalUsers || 0}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-orange-500 opacity-80" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalClaims || 0}</p>
                <p className="text-sm text-muted-foreground">Total Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-500 opacity-80" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalPolicies || 0}</p>
                <p className="text-sm text-muted-foreground">Total Policies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tenants Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tenantData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={tenantData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {tenantData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No tenant data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Claims by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {claimsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={claimsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#006B54" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No claims data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {analytics.revenue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{analytics.revenue.total?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Recurring</p>
                <p className="text-2xl font-bold">{analytics.revenue.monthly?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">{analytics.revenue.pending?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default withAuth(PlatformAnalyticsPage, ['PLATFORM_ADMIN']);
