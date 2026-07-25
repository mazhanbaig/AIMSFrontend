'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data?: { month: string; premium: number; payout: number }[];
  isLoading?: boolean;
}

export function RevenueChart({ data = [], isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Payout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const defaultData = data.length > 0 ? data : [
    { month: 'Jan', premium: 50000, payout: 15000 },
    { month: 'Feb', premium: 55000, payout: 20000 },
    { month: 'Mar', premium: 48000, payout: 12000 },
    { month: 'Apr', premium: 60000, payout: 25000 },
    { month: 'May', premium: 58000, payout: 18000 },
    { month: 'Jun', premium: 65000, payout: 22000 },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Payout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={defaultData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="premium"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Premium"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="payout"
                stroke="#ef4444"
                strokeWidth={2}
                name="Payout"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
