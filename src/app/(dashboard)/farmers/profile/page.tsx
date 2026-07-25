'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FarmerForm } from '@/components/farmers/FarmerForm';
import { useRouter } from 'next/navigation';

export default function FarmerProfilePage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Farmer Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your farmer profile information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Fill in your information to get started with insurance policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FarmerForm
            mode="edit"
            onSuccess={() => router.push('/dashboard')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
