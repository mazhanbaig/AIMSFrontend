'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const COLORS = {
  LOW_RISK: '#22c55e',
  MEDIUM_RISK: '#eab308',
  HIGH_RISK: '#f97316',
  FRAUDULENT: '#ef4444',
};

interface FraudScoreChartProps {
  data?: { name: string; value: number; verdict: string }[];
  isLoading?: boolean;
}

export function FraudScoreChart({ data = [], isLoading }: FraudScoreChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fraud Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const defaultData = data.length > 0 ? data : [
    { name: 'Low Risk', value: 45, verdict: 'LOW_RISK' },
    { name: 'Medium Risk', value: 30, verdict: 'MEDIUM_RISK' },
    { name: 'High Risk', value: 18, verdict: 'HIGH_RISK' },
    { name: 'Fraudulent', value: 7, verdict: 'FRAUDULENT' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={defaultData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {defaultData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.verdict as keyof typeof COLORS] || '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
