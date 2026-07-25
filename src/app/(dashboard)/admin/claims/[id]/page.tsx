'use client';

import { useParams } from 'next/navigation';
import { ClaimReview } from '@/components/claims/ClaimReview';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminClaimReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/admin/claims')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Claims
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Claim Review</h1>
        <p className="text-muted-foreground mt-1">
          Review and process this insurance claim
        </p>
      </div>

      <ClaimReview claimId={id} />
    </div>
  );
}
