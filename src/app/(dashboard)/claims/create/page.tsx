'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClaimForm } from '@/components/claims/ClaimForm';

export default function CreateClaimPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submit a Claim</h1>
        <p className="text-muted-foreground mt-1">
          File a new insurance claim with supporting documents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claim Details</CardTitle>
          <CardDescription>
            Provide information about the incident and upload supporting documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClaimForm onSuccess={() => router.push('/claims')} />
        </CardContent>
      </Card>
    </div>
  );
}
