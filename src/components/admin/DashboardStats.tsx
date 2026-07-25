'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import {
  Users,
  FileText,
  ClipboardCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalFarmers?: number;
    totalPolicies?: number;
    activePolicies?: number;
    totalClaims?: number;
    pendingClaims?: number;
    approvedClaims?: number;
    totalPremium?: number;
    totalPayout?: number;
    farmerGrowth?: number;
    claimGrowth?: number;
  };
  isLoading?: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Farmers',
      value: formatNumber(stats.totalFarmers || 0),
      icon: Users,
      change: stats.farmerGrowth,
      changeLabel: 'vs last month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Policies',
      value: formatNumber(stats.activePolicies || 0),
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Claims',
      value: formatNumber(stats.pendingClaims || 0),
      icon: ClipboardCheck,
      change: stats.claimGrowth,
      changeLabel: 'vs last month',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Premium',
      value: formatCurrency(stats.totalPremium || 0),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn('rounded-full p-2', card.bgColor)}>
                <Icon className={cn('h-4 w-4', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.change !== undefined && (
                <div className="flex items-center gap-1 mt-1 text-xs">
                  {card.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={card.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(card.change)}%
                  </span>
                  <span className="text-muted-foreground">{card.changeLabel}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
