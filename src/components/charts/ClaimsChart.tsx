'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ClaimsChartProps {
  data?: { month: string; submitted: number; approved: number; rejected: number }[];
  isLoading?: boolean;
}

export function ClaimsChart({ data = [], isLoading }: ClaimsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Claims Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const defaultData = data.length > 0 ? data : [
    { month: 'Jan', submitted: 12, approved: 8, rejected: 2 },
    { month: 'Feb', submitted: 15, approved: 11, rejected: 3 },
    { month: 'Mar', submitted: 10, approved: 7, rejected: 2 },
    { month: 'Apr', submitted: 18, approved: 14, rejected: 3 },
    { month: 'May', submitted: 14, approved: 10, rejected: 2 },
    { month: 'Jun', submitted: 20, approved: 16, rejected: 4 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claims Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={defaultData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Bar dataKey="submitted" fill="#3b82f6" name="Submitted" radius={[4, 4, 0, 0]} />
              <Bar dataKey="approved" fill="#22c55e" name="Approved" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#ef4444" name="Rejected" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
