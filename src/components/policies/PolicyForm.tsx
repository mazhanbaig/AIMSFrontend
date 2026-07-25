'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { policyPlanApi } from '@/lib/api-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const policyPlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.string().min(1, 'Type is required'),
  premium: z.coerce.number().min(1, 'Premium must be at least 1'),
  premiumCurrency: z.string().default('USD'),
  deductible: z.coerce.number().min(0, 'Deductible must be 0 or more'),
  maxCoverage: z.coerce.number().min(1, 'Max coverage must be at least 1'),
  durationMonths: z.coerce.number().min(1, 'Duration must be at least 1 month'),
  coverage: z.string().min(5, 'Coverage description is required'),
});

type PolicyPlanFormData = z.infer<typeof policyPlanSchema>;

interface PolicyFormProps {
  initialData?: Partial<PolicyPlanFormData>;
  mode?: 'create' | 'edit';
  planId?: string;
  onSuccess?: () => void;
}

export function PolicyForm({ initialData, mode = 'create', planId, onSuccess }: PolicyFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PolicyPlanFormData>({
    resolver: zodResolver(policyPlanSchema),
    defaultValues: {
      premiumCurrency: 'USD',
      durationMonths: 12,
      ...initialData,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PolicyPlanFormData) => {
      if (mode === 'create') {
        return policyPlanApi.create(data);
      }
      return policyPlanApi.update(planId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-plans'] });
      toast.success(`Policy plan ${mode === 'create' ? 'created' : 'updated'} successfully`);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Failed to ${mode} policy plan`);
    },
  });

  const onSubmit = async (data: PolicyPlanFormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Plan Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" placeholder="Crop Insurance Basic" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">
            Plan Type <span className="text-destructive">*</span>
          </Label>
          <Select
            defaultValue={initialData?.type || watch('type')}
            onValueChange={(v) => setValue('type', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CROP">Crop</SelectItem>
              <SelectItem value="LIVESTOCK">Livestock</SelectItem>
              <SelectItem value="PROPERTY">Property</SelectItem>
              <SelectItem value="LIABILITY">Liability</SelectItem>
              <SelectItem value="WEATHER">Weather</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="description"
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Describe what this plan covers..."
            {...register('description')}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="coverage">
            Coverage Details <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="coverage"
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Covers crop damage due to drought, flood, pests..."
            {...register('coverage')}
          />
          {errors.coverage && <p className="text-sm text-destructive">{errors.coverage.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="premium">
            Premium Amount <span className="text-destructive">*</span>
          </Label>
          <Input id="premium" type="number" min="0" step="0.01" placeholder="500.00" {...register('premium')} />
          {errors.premium && <p className="text-sm text-destructive">{errors.premium.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="premiumCurrency">Currency</Label>
          <Select
            defaultValue={initialData?.premiumCurrency || watch('premiumCurrency') || 'USD'}
            onValueChange={(v) => setValue('premiumCurrency', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
              <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deductible">
            Deductible <span className="text-destructive">*</span>
          </Label>
          <Input id="deductible" type="number" min="0" step="0.01" placeholder="100.00" {...register('deductible')} />
          {errors.deductible && <p className="text-sm text-destructive">{errors.deductible.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCoverage">
            Max Coverage <span className="text-destructive">*</span>
          </Label>
          <Input id="maxCoverage" type="number" min="0" step="0.01" placeholder="10000.00" {...register('maxCoverage')} />
          {errors.maxCoverage && <p className="text-sm text-destructive">{errors.maxCoverage.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="durationMonths">
            Duration (months) <span className="text-destructive">*</span>
          </Label>
          <Input id="durationMonths" type="number" min="1" placeholder="12" {...register('durationMonths')} />
          {errors.durationMonths && <p className="text-sm text-destructive">{errors.durationMonths.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        {(isSubmitting || mutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === 'create' ? 'Create Policy Plan' : 'Update Policy Plan'}
      </Button>
    </form>
  );
}
