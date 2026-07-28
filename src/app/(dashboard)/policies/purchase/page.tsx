'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { usePolicyPlans, usePurchasePolicy } from '@/hooks/usePolicies';
import { landParcelApi } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import { Shield, Clock, DollarSign, MapPin } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PurchasePolicyPage() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedParcelId, setSelectedParcelId] = useState('');
  const purchasePolicy = usePurchasePolicy();

  const { data: plansData, isLoading } = usePolicyPlans({ isActive: true });
  const { data: parcelsData } = useQuery({
    queryKey: ['land-parcels'],
    queryFn: () => landParcelApi.list(),
  });

  const plans = plansData?.data || [];
  const parcels = parcelsData?.data || [];
  const selectedPlan = plans.find((p: any) => p.id === selectedPlanId);
  const selectedParcel = parcels.find((p: any) => p.id === selectedParcelId);

  const handlePurchase = async () => {
    if (!selectedPlanId || !selectedParcelId) return;
    try {
      await purchasePolicy.mutateAsync({
        policyPlanId: selectedPlanId,
        landParcelId: selectedParcelId,
        startDate: new Date().toISOString(),
      });
      router.push('/policies');
    } catch {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading available plans..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Policy</h1>
        <p className="text-muted-foreground mt-1">
          Browse available insurance plans and protect your farm
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Plan Selection */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Available Plans</h2>
          {plans.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No plans available at this time
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((plan: any) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedPlanId === plan.id ? 'ring-2 ring-primary shadow-md' : ''
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <Badge variant="secondary">{plan.cropType}</Badge>
                    </div>
                    <CardDescription className="text-xs line-clamp-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Crop: <strong>{plan.cropType}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Coverage per acre: <strong>{formatCurrency(plan.coveragePerAcre)}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>Premium rate: {plan.premiumRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Term: {plan.termMonths} months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlan ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-medium">{selectedPlan.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Crop</p>
                    <Badge variant="secondary">{selectedPlan.cropType}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Coverage per acre</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedPlan.coveragePerAcre)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Premium rate</p>
                    <p className="font-medium">{selectedPlan.premiumRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Term</p>
                    <p className="font-medium">{selectedPlan.termMonths} months</p>
                  </div>

                  {/* Land Parcel Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="parcel">Land Parcel <span className="text-destructive">*</span></Label>
                    <Select value={selectedParcelId} onValueChange={setSelectedParcelId}>
                      <SelectTrigger>
                        <SelectValue placeholder={parcels.length === 0 ? 'No parcels — create one first' : 'Select a parcel'} />
                      </SelectTrigger>
                      <SelectContent>
                        {parcels.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.address || p.landTitleNumber} ({p.areaAcres} acres)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handlePurchase}
                    disabled={purchasePolicy.isPending || !selectedParcelId}
                  >
                    {purchasePolicy.isPending ? 'Purchasing...' : 'Purchase Now'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Select a plan to see the summary
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
