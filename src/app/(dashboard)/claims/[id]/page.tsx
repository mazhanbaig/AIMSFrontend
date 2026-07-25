'use client';

import { useParams, useRouter } from 'next/navigation';
import { useClaim } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ClaimStatusBadge } from '@/components/claims/ClaimStatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, AlertTriangle, CalendarDays, DollarSign, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: rawClaim, isLoading } = useClaim(id);
  const claim = rawClaim?.data || rawClaim;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading claim details..." />;
  }

  if (!claim) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive">Claim not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/claims')}>
          Back to Claims
        </Button>
      </div>
    );
  }

  const fraudColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    if (score < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const fraudBg = (score: number) => {
    if (score < 30) return 'bg-green-100';
    if (score < 60) return 'bg-yellow-100';
    if (score < 80) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/claims')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Claims
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{claim.title}</h1>
          <p className="text-muted-foreground font-mono mt-1">#{claim.claimNumber}</p>
        </div>
        <ClaimStatusBadge status={claim.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Claim Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Incident Date
                </p>
                <p className="font-medium">{formatDate(claim.incidentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Reported
                </p>
                <p className="font-medium">{formatDate(claim.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Estimated Loss
                </p>
                <p className="font-medium">{formatCurrency(claim.estimatedLoss, claim.estimatedLossCurrency)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Approved Amount
                </p>
                <p className="font-medium">
                  {claim.approvedAmount ? formatCurrency(claim.approvedAmount, claim.approvedAmountCurrency) : 'Pending'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <Badge variant={claim.priority === 'URGENT' ? 'destructive' : claim.priority === 'HIGH' ? 'warning' : 'secondary'}>
                  {claim.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Assigned To
                </p>
                <p className="font-medium">{claim.assignedToUser?.name || 'Unassigned'}</p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{claim.description}</p>
            </div>
          </CardContent>
        </Card>

        {claim.fraudScore !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Fraud Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn('rounded-full p-4', fraudBg(claim.fraudScore))}>
                  <span className={cn('text-2xl font-bold', fraudColor(claim.fraudScore))}>
                    {claim.fraudScore}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {claim.fraudVerdict?.replace(/_/g, ' ') || 'Not Analyzed'}
                  </p>
                  <p className="text-sm text-muted-foreground">Fraud Score / 100</p>
                </div>
              </div>
              <Progress value={claim.fraudScore} className={cn('h-2', fraudBg(claim.fraudScore))} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Documents */}
      {claim.documents?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents ({claim.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {claim.documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{doc.fileName}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
