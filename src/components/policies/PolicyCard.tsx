'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { FileText, CalendarDays, Shield } from 'lucide-react';

interface PolicyCardProps {
  policy: {
    id: string;
    policyNumber: string;
    status: string;
    startDate: string;
    endDate: string;
    premium: number;
    premiumCurrency?: string;
    sumInsured?: number;
    policyPlan?: {
      name: string;
      type: string;
    };
    farmer?: {
      name: string;
    };
  };
  onClick?: () => void;
}

const statusColors: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
  ACTIVE: 'success',
  EXPIRED: 'secondary',
  CANCELLED: 'destructive',
  PENDING: 'warning',
};

export function PolicyCard({ policy, onClick }: PolicyCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {policy.policyPlan?.name || 'Policy'}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-mono">
              {policy.policyNumber}
            </p>
          </div>
          <Badge variant={statusColors[policy.status] || 'default'}>
            {policy.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span className="font-medium">{policy.policyPlan?.type || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>
              {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>Premium: {formatCurrency(policy.premium, policy.premiumCurrency)}</span>
          </div>
          {policy.farmer?.name && (
            <p className="text-xs text-muted-foreground pt-1 border-t">
              {policy.farmer.name}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
