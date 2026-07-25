'use client';

import React, { useState } from 'react';
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
import { FileUpload } from '@/components/forms/FileUpload';
import { useCreateClaim } from '@/hooks/useClaims';
import { usePolicies } from '@/hooks/usePolicies';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const claimSchema = z.object({
  policyId: z.string().min(1, 'Policy is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  incidentDate: z.string().min(1, 'Incident date is required'),
  estimatedLoss: z.coerce.number().min(1, 'Estimated loss is required'),
});

type ClaimFormData = z.infer<typeof claimSchema>;

interface ClaimFormProps {
  onSuccess?: () => void;
}

export function ClaimForm({ onSuccess }: ClaimFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const createClaim = useCreateClaim();

  const { data: policiesData } = usePolicies({ status: 'ACTIVE' });
  const policies = policiesData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
  });

  const onSubmit = async (data: ClaimFormData) => {
    try {
      await createClaim.mutateAsync({
        ...data,
        documents: files,
      });
      toast.success('Claim submitted successfully');
      onSuccess?.();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Policy Selection */}
        <div className="space-y-2">
          <Label htmlFor="policyId">
            Policy <span className="text-destructive">*</span>
          </Label>
          <Select
            value={watch('policyId')}
            onValueChange={(v) => setValue('policyId', v)}
          >
            <SelectTrigger className={errors.policyId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select a policy" />
            </SelectTrigger>
            <SelectContent>
              {policies.map((policy: any) => (
                <SelectItem key={policy.id} value={policy.id}>
                  {policy.policyPlan?.name} - {policy.policyNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.policyId && (
            <p className="text-sm text-destructive">{errors.policyId.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Claim Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., Crop damage due to heavy rainfall"
            className={errors.title ? 'border-destructive' : ''}
            {...register('title')}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="description"
            rows={4}
            className={`flex w-full rounded-md border ${
              errors.description ? 'border-destructive' : 'border-input'
            } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            placeholder="Describe the incident in detail..."
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Incident Date */}
        <div className="space-y-2">
          <Label htmlFor="incidentDate">
            Incident Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="incidentDate"
            type="date"
            className={errors.incidentDate ? 'border-destructive' : ''}
            {...register('incidentDate')}
          />
          {errors.incidentDate && (
            <p className="text-sm text-destructive">{errors.incidentDate.message}</p>
          )}
        </div>

        {/* Estimated Loss */}
        <div className="space-y-2">
          <Label htmlFor="estimatedLoss">
            Estimated Loss (USD) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="estimatedLoss"
            type="number"
            min="0"
            step="0.01"
            placeholder="5000.00"
            className={errors.estimatedLoss ? 'border-destructive' : ''}
            {...register('estimatedLoss')}
          />
          {errors.estimatedLoss && (
            <p className="text-sm text-destructive">{errors.estimatedLoss.message}</p>
          )}
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <Label>Supporting Documents</Label>
          <FileUpload
            onUpload={(uploadedFiles) => setFiles((prev) => [...prev, ...uploadedFiles])}
            onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
            multiple={true}
            maxFiles={10}
          />
          <p className="text-xs text-muted-foreground">
            Upload images, videos, or documents supporting your claim
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Claim
      </Button>
    </form>
  );
}
