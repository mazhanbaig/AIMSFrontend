'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { FraudTierSelector } from '@/components/admin/FraudTierSelector';
import { withAuth } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your tenant settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SettingsForm />
        </TabsContent>

        <TabsContent value="fraud">
          <FraudTierSelector />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/settings/fields"
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="font-medium">Custom Fields</h3>
            <p className="text-sm text-muted-foreground">Manage dynamic form fields</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          href="/admin/settings/iam"
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="font-medium">IAM & Roles</h3>
            <p className="text-sm text-muted-foreground">Manage permissions</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          href="/admin/billing"
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="font-medium">Billing</h3>
            <p className="text-sm text-muted-foreground">Subscription & invoices</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage, ['TENANT_ADMIN']);
