'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ClaimsChart } from '@/components/charts/ClaimsChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { FraudScoreChart } from '@/components/charts/FraudScoreChart';
import { withAuth } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

function AdminAnalyticsPage() {
  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminApi.getAnalytics({ period: '30d' }),
  });

  const stats = dashData?.data || {};
  const isLoading = dashLoading || analyticsLoading;

  const metrics = [
    {
      label: 'Total Policies',
      value: stats.totalPolicies || stats.policiesCount || 0,
      icon: FileText,
      trend: '+12.5%',
      trendUp: true,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Total Premiums',
      value: stats.totalPremiums != null ? formatCurrency(stats.totalPremiums, stats.premiumCurrency) : '$0',
      icon: DollarSign,
      trend: '+8.2%',
      trendUp: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Payouts',
      value: stats.totalPayouts != null ? formatCurrency(stats.totalPayouts, stats.payoutCurrency) : '$0',
      icon: TrendingDown,
      trend: '-2.4%',
      trendUp: false,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Loss Ratio',
      value: stats.lossRatio ? `${stats.lossRatio}%` : '32.1%',
      icon: BarChart3,
      trend: 'Healthy',
      trendUp: true,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Active Claims',
      value: stats.activeClaims || stats.pendingClaims || 0,
      icon: AlertTriangle,
      trend: '-5.1%',
      trendUp: false,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Approved Claims',
      value: stats.approvedClaims || 0,
      icon: CheckCircle2,
      trend: '+18.3%',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading analytics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Insurance Analytics</h1>
          <p className="text-[#666666] mt-1">
            Comprehensive performance metrics and claims efficiency reporting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button className="px-4 py-1.5 bg-white text-[#006B54] rounded-full text-xs font-semibold shadow-sm">
              Real-time
            </button>
            <button className="px-4 py-1.5 text-gray-500 rounded-full text-xs font-medium">
              Historical
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8ECEF] rounded-full px-5 py-3 flex items-center gap-3">
          <BarChart3 className="h-4 w-4 text-[#006B54]" />
          <select className="bg-transparent border-none focus:ring-0 text-sm text-[#1A1A1A] w-full appearance-none">
            <option>Last 30 Days</option>
            <option>Quarter to Date</option>
            <option>Year to Date</option>
            <option>Custom Range</option>
          </select>
        </div>
        <div className="bg-white border border-[#E8ECEF] rounded-full px-5 py-3 flex items-center gap-3">
          <Users className="h-4 w-4 text-[#006B54]" />
          <select className="bg-transparent border-none focus:ring-0 text-sm text-[#1A1A1A] w-full appearance-none">
            <option>All Crop Types</option>
            <option>Wheat</option>
            <option>Corn</option>
            <option>Rice</option>
          </select>
        </div>
        <div className="bg-white border border-[#E8ECEF] rounded-full px-5 py-3 flex items-center gap-3">
          <FileText className="h-4 w-4 text-[#006B54]" />
          <select className="bg-transparent border-none focus:ring-0 text-sm text-[#1A1A1A] w-full appearance-none">
            <option>All Regions</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia Pacific</option>
          </select>
        </div>
        <Button variant="outline" className="rounded-full">
          <BarChart3 className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="bg-white border-t-4 border-t-[#006B54]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`rounded-full p-2 ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs rounded-full ${
                      metric.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {metric.trendUp ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.trend}
                  </Badge>
                </div>
                <p className="text-xs text-[#666666] font-medium uppercase tracking-wider">
                  {metric.label}
                </p>
                <p className="text-xl font-bold text-[#1A1A1A] mt-1">{metric.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Claims Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ClaimsChart />
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
      </div>

      {/* Fraud & Processing */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Fraud Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <FraudScoreChart />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Processing Time by Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 h-48 items-end">
              {[
                { name: 'M. Chen', height: 40, avg: '3.2h' },
                { name: 'S. Gupta', height: 65, avg: '4.5h' },
                { name: 'J. Doe', height: 90, avg: '2.8h' },
                { name: 'R. Miller', height: 30, avg: '5.1h' },
                { name: 'A. White', height: 55, avg: '3.8h' },
              ].map((officer) => (
                <div key={officer.name} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#006B54] rounded-t-lg transition-all hover:brightness-110 cursor-pointer min-h-[20px]"
                    style={{ height: `${officer.height}%` }}
                  />
                  <span className="text-[10px] font-medium text-[#666666]">{officer.name}</span>
                  <span className="text-[9px] text-[#006B54] font-semibold">{officer.avg}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-[#E8ECEF] pt-4 flex justify-between items-center">
              <span className="text-[10px] text-[#666666] font-medium">Y-AXIS: HOURS PER CLAIM</span>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-[#006B54]" />
                <span className="text-[10px] font-medium text-[#006B54]">Avg: 4.2h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims by Crop Type */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Claims by Crop Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { crop: 'Wheat', count: 1240, percentage: 85 },
              { crop: 'Corn', count: 982, percentage: 65 },
              { crop: 'Rice', count: 420, percentage: 30 },
              { crop: 'Others', count: 154, percentage: 15 },
            ].map((item) => (
              <div key={item.crop} className="space-y-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[#1A1A1A]">{item.crop}</span>
                  <span className="text-[#666666]">{item.count.toLocaleString()}</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006B54] rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(AdminAnalyticsPage, ['TENANT_ADMIN', 'PLATFORM_ADMIN']);
