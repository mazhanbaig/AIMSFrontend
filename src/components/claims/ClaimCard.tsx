'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClaimStatusBadge } from './ClaimStatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { AlertTriangle, CalendarDays, FileText, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ClaimCardProps {
  claim: {
    id: string;
    claimNumber: string;
    title: string;
    status: string;
    priority: string;
    incidentDate: string;
    estimatedLoss: number;
    estimatedLossCurrency?: string;
    fraudScore?: number;
    fraudVerdict?: string;
    farmer?: { name: string };
    policy?: { policyNumber: string };
    assignedToUser?: { name: string };
    createdAt: string;
  };
  onClick?: () => void;
}

const priorityColors: Record<string, string> = {
  LOW: 'text-green-600',
  MEDIUM: 'text-yellow-600',
  HIGH: 'text-orange-600',
  URGENT: 'text-red-600',
};

export function ClaimCard({ claim, onClick }: ClaimCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base truncate max-w-[250px]">
              {claim.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-mono">
              #{claim.claimNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {claim.fraudScore !== undefined && claim.fraudScore > 50 && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            <ClaimStatusBadge status={claim.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>Incident: {formatDate(claim.incidentDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>Loss: {formatCurrency(claim.estimatedLoss, claim.estimatedLossCurrency)}</span>
          </div>
          {claim.farmer?.name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{claim.farmer.name}</span>
            </div>
          )}
          {claim.fraudScore !== undefined && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Fraud Score</span>
                <span className={cn(
                  'font-medium',
                  claim.fraudScore < 30 ? 'text-green-600' : claim.fraudScore < 60 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {claim.fraudScore}/100
                </span>
              </div>
              <Progress value={claim.fraudScore} className={cn(
                'h-1.5',
                claim.fraudScore < 30 ? 'bg-green-100' : claim.fraudScore < 60 ? 'bg-yellow-100' : 'bg-red-100'
              )} />
            </div>
          )}
          <div className="flex items-center justify-between pt-1 border-t text-xs text-muted-foreground mt-2">
            <span className={cn('font-medium', priorityColors[claim.priority] || '')}>
              {claim.priority} Priority
            </span>
            {claim.assignedToUser?.name && (
              <span>Assigned to: {claim.assignedToUser.name}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
