'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const tenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  domain: z.string().optional(),
  primaryColor: z.string().optional(),
  subscriptionTier: z.string().optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  initialData?: Partial<TenantFormData>;
  mode?: 'create' | 'edit';
  tenantId?: string;
}

export function TenantForm({ initialData, mode = 'create', tenantId }: TenantFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData,
  });

  const mutation = useMutation({
    mutationFn: (data: TenantFormData) => {
      if (mode === 'create') {
        return platformApi.createTenant(data);
      }
      return platformApi.updateTenant(tenantId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success(`Tenant ${mode === 'create' ? 'created' : 'updated'} successfully`);
      router.push('/platform/tenants');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Failed to ${mode} tenant`);
    },
  });

  const onSubmit = async (data: TenantFormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Tenant' : 'Edit Tenant'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="Acme Insurance" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
              <Input id="slug" placeholder="acme-insurance" {...register('slug')} disabled={mode === 'edit'} />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              <p className="text-xs text-muted-foreground">Used for subdomain: acme-insurance.yourapp.com</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Custom Domain</Label>
              <Input id="domain" placeholder="insurance.example.com" {...register('domain')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionTier">Subscription Tier</Label>
              <select
                id="subscriptionTier"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('subscriptionTier')}
              >
                <option value="">Select tier</option>
                <option value="FREE">Free</option>
                <option value="BASIC">Basic</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">Brand Color</Label>
              <Input id="primaryColor" type="color" className="h-10" {...register('primaryColor')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create Tenant' : 'Update Tenant'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
