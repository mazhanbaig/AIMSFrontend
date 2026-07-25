'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Globe, CalendarDays, Users, CreditCard, Sprout } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

interface TenantCardProps {
  tenant: {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    logo?: string;
    primaryColor?: string;
    isActive: boolean;
    subscriptionTier?: string;
    subscriptionStatus?: string;
    settings?: any;
    _count?: {
      farmers?: number;
      staff?: number;
      policies?: number;
    };
    createdAt: string;
  };
  onSeed?: () => void;
}

export function TenantCard({ tenant, onSeed }: TenantCardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Main Info */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: tenant.primaryColor || '#3b82f6' }}
              >
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{tenant.name}</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">{tenant.slug}</p>
              </div>
            </div>
            <Badge variant={tenant.isActive ? 'success' : 'secondary'}>
              {tenant.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {tenant.domain && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={`https://${tenant.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {tenant.domain}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Created {formatDate(tenant.createdAt)}</span>
          </div>
          {tenant._count && (
            <div className="flex gap-6 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{tenant._count.farmers || 0}</strong> Farmers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{tenant._count.staff || 0}</strong> Staff
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{tenant._count.policies || 0}</strong> Policies
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Tier</p>
            <p className="text-lg font-semibold">{tenant.subscriptionTier || 'Free'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={tenant.subscriptionStatus === 'ACTIVE' ? 'success' : 'secondary'}>
              {tenant.subscriptionStatus || 'N/A'}
            </Badge>
          </div>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">Actions</p>
            <div className="space-y-2">
              {onSeed && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={onSeed}
                >
                  <Sprout className="mr-2 h-4 w-4" />
                  Seed Data
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
