'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePolicy } from '@/hooks/usePolicies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Shield, CalendarDays, DollarSign, FileText, Clock } from 'lucide-react';

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: rawPolicy, isLoading } = usePolicy(id);
  const policy = rawPolicy?.data || rawPolicy;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading policy details..." />;
  }

  if (!policy) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive">Policy not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/policies')}>
          Back to Policies
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
    ACTIVE: 'success',
    EXPIRED: 'secondary',
    CANCELLED: 'destructive',
    PENDING: 'warning',
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/policies')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Policies
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {policy.policyPlan?.name || 'Policy'}
          </h1>
          <p className="text-muted-foreground font-mono mt-1">{policy.policyNumber}</p>
        </div>
        <Badge variant={statusColors[policy.status] || 'default'} className="text-sm px-4 py-1">
          {policy.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Coverage Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sum Insured</p>
                <p className="font-medium text-lg">{formatCurrency(policy.sumInsured, policy.premiumCurrency)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deductible</p>
                <p className="font-medium">{formatCurrency(policy.deductible, policy.premiumCurrency)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Premium</p>
                <p className="font-medium">{formatCurrency(policy.premium, policy.premiumCurrency)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan Type</p>
                <Badge variant="secondary">{policy.policyPlan?.type || 'N/A'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Policy Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(policy.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(policy.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(policy.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {Math.round((new Date(policy.endDate).getTime() - new Date(policy.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {policy.parcel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Insured Parcel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{policy.parcel.name}</p>
            <p className="text-sm text-muted-foreground">{policy.parcel.location}</p>
            {policy.parcel.size && (
              <p className="text-sm text-muted-foreground">Size: {policy.parcel.size} {policy.parcel.unit}</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button onClick={() => router.push('/claims/create')}>
          File a Claim
        </Button>
        <Button variant="outline" onClick={() => router.push('/policies')}>
          Back to Policies
        </Button>
      </div>
    </div>
  );
}
