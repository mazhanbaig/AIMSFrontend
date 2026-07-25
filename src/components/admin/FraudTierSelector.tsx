'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function FraudTierSelector() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['fraud-tier'],
    queryFn: () => settingsApi.getFraudTier(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => settingsApi.updateFraudTier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraud-tier'] });
      toast.success('Fraud tier configuration updated');
    },
    onError: () => toast.error('Failed to update fraud tier'),
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: data?.data || {},
  });

  if (isLoading) return <LoadingSpinner size="lg" text="Loading fraud configuration..." />;

  const fraudTier = data?.data || {};

  const onSubmit = async (formData: any) => {
    await mutation.mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Low Risk Threshold</Label>
              <Input
                type="number"
                min="0"
                max="100"
                defaultValue={fraudTier.lowRiskThreshold || 30}
                {...register('lowRiskThreshold')}
              />
              <p className="text-xs text-muted-foreground">Scores below this are low risk</p>
            </div>
            <div className="space-y-2">
              <Label>Medium Risk Threshold</Label>
              <Input
                type="number"
                min="0"
                max="100"
                defaultValue={fraudTier.mediumRiskThreshold || 60}
                {...register('mediumRiskThreshold')}
              />
              <p className="text-xs text-muted-foreground">Scores below this are medium risk</p>
            </div>
            <div className="space-y-2">
              <Label>High Risk Threshold</Label>
              <Input
                type="number"
                min="0"
                max="100"
                defaultValue={fraudTier.highRiskThreshold || 80}
                {...register('highRiskThreshold')}
              />
              <p className="text-xs text-muted-foreground">Scores above this are high risk/fraud</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Auto-Reject Score</Label>
            <Input
              type="number"
              min="0"
              max="100"
              defaultValue={fraudTier.autoRejectScore || 90}
              {...register('autoRejectScore')}
            />
            <p className="text-xs text-muted-foreground">
              Claims with fraud score above this are automatically rejected
            </p>
          </div>

          <div className="space-y-2">
            <Label>Auto-Approve Score</Label>
            <Input
              type="number"
              min="0"
              max="100"
              defaultValue={fraudTier.autoApproveScore || 10}
              {...register('autoApproveScore')}
            />
            <p className="text-xs text-muted-foreground">
              Claims with fraud score below this are automatically approved
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Configuration
      </Button>
    </form>
  );
}
