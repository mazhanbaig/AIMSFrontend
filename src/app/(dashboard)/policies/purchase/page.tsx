'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePolicyPlans, usePurchasePolicy } from '@/hooks/usePolicies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import { Shield, Clock, DollarSign, FileText } from 'lucide-react';

export default function PurchasePolicyPage() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const purchasePolicy = usePurchasePolicy();

  const { data: plansData, isLoading } = usePolicyPlans({ isActive: true });

  const plans = plansData?.data || [];
  const selectedPlan = plans.find((p: any) => p.id === selectedPlanId);

  const handlePurchase = async () => {
    if (!selectedPlanId) return;
    try {
      await purchasePolicy.mutateAsync({
        policyPlanId: selectedPlanId,
        startDate: new Date().toISOString().split('T')[0],
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
                      <Badge variant="secondary">{plan.type}</Badge>
                    </div>
                    <CardDescription className="text-xs line-clamp-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Premium: <strong>{formatCurrency(plan.premium, plan.premiumCurrency)}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>Coverage: {formatCurrency(plan.maxCoverage, plan.premiumCurrency)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Duration: {plan.durationMonths} months</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>Deductible: {formatCurrency(plan.deductible, plan.premiumCurrency)}</span>
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
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant="secondary">{selectedPlan.type}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Premium</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedPlan.premium, selectedPlan.premiumCurrency)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Coverage Amount</p>
                    <p className="font-medium">
                      {formatCurrency(selectedPlan.maxCoverage, selectedPlan.premiumCurrency)}
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handlePurchase}
                    disabled={purchasePolicy.isPending}
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
