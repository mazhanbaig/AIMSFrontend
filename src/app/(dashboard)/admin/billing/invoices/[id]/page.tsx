'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '@/lib/utils';
import { withAuth } from '@/lib/auth';
import {
  ArrowLeft,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['billing-invoice', id],
    queryFn: () => billingApi.getInvoice(id),
  });

  const payMutation = useMutation({
    mutationFn: () => billingApi.payInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-status'] });
      toast.success('Invoice paid successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to pay invoice'),
  });

  const invoice = data?.data || data;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading invoice..." />;
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="text-lg font-medium">Invoice not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/billing')}>
          Back to Billing
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PAID: 'default',
    PENDING: 'secondary',
    OVERDUE: 'destructive',
    CANCELLED: 'outline',
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Navigation */}
      <Button variant="ghost" onClick={() => router.push('/admin/billing')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Billing
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Invoice #{invoice.invoiceNumber || invoice.id?.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {invoice.description || 'Invoice details and payment status'}
          </p>
        </div>
        {invoice.status && (
          <Badge variant={statusColors[invoice.status] || 'secondary'} className="text-sm px-4 py-1.5 rounded-full">
            {invoice.status}
          </Badge>
        )}
      </div>

      {/* Invoice Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Amount & Payment */}
        <Card className="border-t-4 border-t-[#006B54]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#006B54]" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-4xl font-bold text-[#1A1A1A]">
                {formatCurrency(invoice.amount, invoice.currency)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="font-medium">{formatDate(invoice.issueDate || invoice.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={statusColors[invoice.status] || 'secondary'} className="rounded-full">
                  {invoice.status || 'N/A'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid At</p>
                <p className="font-medium">{invoice.paidAt ? formatDate(invoice.paidAt) : 'Not paid'}</p>
              </div>
            </div>
            {invoice.status === 'PENDING' && (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  if (confirm('Pay this invoice now?')) payMutation.mutateAsync();
                }}
                disabled={payMutation.isPending}
              >
                {payMutation.isPending ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </>
                )}
              </Button>
            )}
            {invoice.status === 'OVERDUE' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>This invoice is overdue. Please pay immediately to avoid service interruption.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Period Start</p>
                <p className="font-medium">{formatDate(invoice.periodStart)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Period End</p>
                <p className="font-medium">{formatDate(invoice.periodEnd)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subscription</p>
                <p className="font-medium">{invoice.subscriptionTier || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{invoice.paymentMethod || 'Not specified'}</p>
              </div>
            </div>
            {invoice.lineItems && invoice.lineItems.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Line Items</p>
                <div className="space-y-2">
                  {invoice.lineItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span>{item.description}</span>
                      <span className="font-medium">
                        {formatCurrency(item.amount, item.currency || invoice.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Billing Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Billing Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Company Name</p>
              <p className="font-medium">{invoice.billingCompany || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Billing Email</p>
                <p className="font-medium">{invoice.billingEmail || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Billing Phone</p>
                <p className="font-medium">{invoice.billingPhone || 'N/A'}</p>
              </div>
            </div>
          </div>
          {invoice.billingAddress && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Billing Address</p>
              <p className="font-medium">{invoice.billingAddress}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        {invoice.status === 'PAID' && (
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <CheckCircle className="h-4 w-4" />
            Payment Confirmed
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(InvoiceDetailPage, ['TENANT_ADMIN', 'PLATFORM_ADMIN']);
