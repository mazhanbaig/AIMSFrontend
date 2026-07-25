'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard, Download, FileText } from 'lucide-react';
import { withAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

const TIERS = ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'];

function BillingPage() {
  const queryClient = useQueryClient();

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['billing-status'],
    queryFn: () => billingApi.getStatus(),
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ['billing-invoices'],
    queryFn: () => billingApi.listInvoices(),
  });

  const subscribeMutation = useMutation({
    mutationFn: (tier: string) => billingApi.subscribe(tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-status'] });
      toast.success('Subscription updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update subscription'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => billingApi.cancel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-status'] });
      toast.success('Subscription cancelled');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to cancel subscription'),
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => billingApi.payInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-status'] });
      toast.success('Invoice paid');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to pay invoice'),
  });

  const subscription = statusData?.data;
  const invoices = invoicesData?.data || [];

  if (statusLoading || invoicesLoading) {
    return <LoadingSpinner size="lg" text="Loading billing info..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and invoices</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <p className="text-2xl font-bold">{subscription.tier || 'Free'}</p>
                  </div>
                  <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {subscription.status}
                  </Badge>
                </div>
                {subscription.currentPeriodStart && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Period Start</p>
                      <p className="font-medium">{formatDate(subscription.currentPeriodStart)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Period End</p>
                      <p className="font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Change Plan</p>
                  <div className="flex flex-wrap gap-2">
                    {TIERS.filter(t => t !== subscription.tier).map(tier => (
                      <Button
                        key={tier}
                        variant="outline"
                        size="sm"
                        onClick={() => subscribeMutation.mutateAsync(tier)}
                        disabled={subscribeMutation.isPending}
                      >
                        {tier.charAt(0) + tier.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                {subscription.status === 'ACTIVE' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { if (confirm('Cancel subscription?')) cancelMutation.mutateAsync(); }}
                    disabled={cancelMutation.isPending}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-center py-2 text-muted-foreground">No active subscription</p>
                {TIERS.filter(t => t !== 'FREE').map(tier => (
                  <Button
                    key={tier}
                    variant="outline"
                    className="w-full"
                    onClick={() => subscribeMutation.mutateAsync(tier)}
                    disabled={subscribeMutation.isPending}
                  >
                    Subscribe to {tier.charAt(0) + tier.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No invoices yet</p>
            ) : (
              <div className="space-y-2">
                {invoices.slice(0, 5).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </span>
                      <Badge variant={invoice.status === 'PAID' ? 'default' : invoice.status === 'PENDING' ? 'warning' : 'secondary'} className="text-xs">
                        {invoice.status}
                      </Badge>
                      {invoice.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => payMutation.mutateAsync(invoice.id)}
                          disabled={payMutation.isPending}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(BillingPage, ['TENANT_ADMIN']);
