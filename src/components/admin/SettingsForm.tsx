'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function SettingsForm() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getSettings(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => settingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: () => toast.error('Failed to update settings'),
  });

  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: data?.data || {},
  });

  if (isLoading) return <LoadingSpinner size="lg" text="Loading settings..." />;

  const settings = data?.data || {};

  const onSubmit = async (formData: any) => {
    await mutation.mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Select
              defaultValue={settings.defaultCurrency || 'USD'}
              onValueChange={(v) => setValue('defaultCurrency', v)}
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
            <Label>Timezone</Label>
            <Select
              defaultValue={settings.timezone || 'UTC'}
              onValueChange={(v) => setValue('timezone', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern (US)</SelectItem>
                <SelectItem value="Africa/Nairobi">East Africa (Nairobi)</SelectItem>
                <SelectItem value="Africa/Lagos">West Africa (Lagos)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              defaultValue={settings.language || 'en'}
              onValueChange={(v) => setValue('language', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Fraud Detection</Label>
              <p className="text-xs text-muted-foreground">Automatically analyze claims for fraud</p>
            </div>
            <Switch
              defaultChecked={settings.enableFraudDetection}
              onCheckedChange={(v) => setValue('enableFraudDetection', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Notifications</Label>
              <p className="text-xs text-muted-foreground">Send email and in-app notifications</p>
            </div>
            <Switch
              defaultChecked={settings.enableNotifications}
              onCheckedChange={(v) => setValue('enableNotifications', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Billing</Label>
              <p className="text-xs text-muted-foreground">Enable subscription and invoicing</p>
            </div>
            <Switch
              defaultChecked={settings.enableBilling}
              onCheckedChange={(v) => setValue('enableBilling', v)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Settings
      </Button>
    </form>
  );
}
