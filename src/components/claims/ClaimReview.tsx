'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api-client';
import { useClaim, useUpdateClaimStatus, useAssignClaim, useFraudAnalysis } from '@/hooks/useClaims';
import { ClaimStatusBadge } from './ClaimStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate, formatCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertTriangle, ThumbsUp, ThumbsDown, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClaimReviewProps {
  claimId: string;
}

export function ClaimReview({ claimId }: ClaimReviewProps) {
  const [newStatus, setNewStatus] = useState('');
  const [assignTo, setAssignTo] = useState('');

  const { data: claimData, isLoading } = useClaim(claimId);
  const { data: fraudData } = useFraudAnalysis(claimId);
  const { data: staffData } = useQuery({
    queryKey: ['staff-list'],
    queryFn: () => adminApi.listStaff({ limit: 100 }),
  });
  const updateStatus = useUpdateClaimStatus();
  const assignClaim = useAssignClaim();

  const staffList = staffData?.data?.data || staffData?.data || [];

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading claim details..." />;
  }

  const claim = claimData?.data || claimData;

  if (!claim) {
    return (
      <div className="text-center py-12 text-destructive">
        Claim not found
      </div>
    );
  }

  const fraudScore = fraudData?.data?.score || claim.fraudScore;
  const fraudVerdict = fraudData?.data?.verdict || claim.fraudVerdict;
  const fraudDetails = fraudData?.data?.details || claim.fraudDetails;

  const getFraudColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    if (score < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getFraudBg = (score: number) => {
    if (score < 30) return 'bg-green-100';
    if (score < 60) return 'bg-yellow-100';
    if (score < 80) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    await updateStatus.mutateAsync({
      id: claimId,
      data: { status: newStatus as any },
    });
  };

  const handleAssign = async () => {
    if (!assignTo) return;
    await assignClaim.mutateAsync({
      id: claimId,
      data: { assignedTo: assignTo },
    });
  };

  return (
    <div className="space-y-6">
      {/* Claim Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{claim.title}</CardTitle>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                #{claim.claimNumber}
              </p>
            </div>
            <ClaimStatusBadge status={claim.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Incident Date</p>
              <p className="font-medium">{formatDate(claim.incidentDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reported Date</p>
              <p className="font-medium">{formatDate(claim.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Loss</p>
              <p className="font-medium">
                {formatCurrency(claim.estimatedLoss, claim.estimatedLossCurrency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved Amount</p>
              <p className="font-medium">
                {claim.approvedAmount
                  ? formatCurrency(claim.approvedAmount, claim.approvedAmountCurrency)
                  : 'Pending'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <Badge variant={claim.priority === 'URGENT' ? 'destructive' : claim.priority === 'HIGH' ? 'warning' : 'secondary'}>
                {claim.priority}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned To</p>
              <p className="font-medium">{claim.assignedToUser?.name || 'Unassigned'}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{claim.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Analysis */}
      {fraudScore !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Fraud Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className={cn('rounded-full p-3', getFraudBg(fraudScore))}>
                <span className={cn('text-2xl font-bold', getFraudColor(fraudScore))}>
                  {fraudScore}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold">{fraudVerdict?.replace(/_/g, ' ')}</p>
                <p className="text-sm text-muted-foreground">Fraud Score</p>
              </div>
            </div>
            <Progress
              value={fraudScore}
              className={cn('h-2', getFraudBg(fraudScore))}
            />

            {fraudDetails?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Analysis Details:</p>
                {fraudDetails.map((detail: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {detail.matched ? (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                      )}
                      <span>{detail.ruleName}</span>
                    </div>
                    <span className={cn('font-medium', detail.matched ? 'text-orange-600' : 'text-green-600')}>
                      {detail.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Update Status */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Update Status</p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="INVESTIGATION">Investigation</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updateStatus.isPending}
              >
                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>

            {/* Assign */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Assign To</p>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.length > 0 ? (
                      staffList.map((staff: any) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name || staff.email}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No staff available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAssign}
                disabled={!assignTo || assignClaim.isPending}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                {assignClaim.isPending ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      {claim.documents?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents ({claim.documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {claim.documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{doc.fileName}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {claim.notes?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notes ({claim.notes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {claim.notes.map((note: any) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{note.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
