'use client';

import { useFarmer } from '@/hooks/useFarmers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { User, MapPin, Phone, Calendar, CreditCard, CheckCircle } from 'lucide-react';

export default function FarmerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, isLoading } = useFarmer(id);

  const farmer = data?.data || data;

  if (isLoading) return <LoadingSpinner size="lg" text="Loading farmer..." />;
  if (!farmer) return <div className="text-center py-12 text-destructive">Farmer not found</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{farmer.name}</h1>
        <p className="text-muted-foreground mt-1">Farmer Details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{farmer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium flex items-center gap-1"><Phone className="h-3 w-3" />{farmer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{farmer.user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={farmer.isVerified ? 'success' : 'secondary'}>
                {farmer.isVerified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
            {farmer.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {farmer.address}{farmer.city ? `, ${farmer.city}` : ''}{farmer.state ? `, ${farmer.state}` : ''}
                </p>
              </div>
            )}
            {farmer.dateOfBirth && (
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(farmer.dateOfBirth)}
                </p>
              </div>
            )}
            {farmer.governmentId && (
              <div>
                <p className="text-sm text-muted-foreground">Government ID</p>
                <p className="font-medium font-mono">{farmer.governmentId}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {farmer.landParcels && farmer.landParcels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Land Parcels ({farmer.landParcels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {farmer.landParcels.map((parcel: any) => (
                <div key={parcel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{parcel.name}</p>
                    <p className="text-sm text-muted-foreground">{parcel.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{parcel.size} {parcel.unit}</p>
                    {parcel.cropType && <p className="text-xs text-muted-foreground">{parcel.cropType}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {farmer.policies && farmer.policies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Policies ({farmer.policies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {farmer.policies.map((policy: any) => (
                <div key={policy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{policy.policyPlan?.name || policy.policyNumber}</p>
                    <p className="text-sm text-muted-foreground">{policy.policyNumber}</p>
                  </div>
                  <Badge variant={policy.status === 'ACTIVE' ? 'success' : 'secondary'}>{policy.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {farmer.dynamicFields && Object.keys(farmer.dynamicFields).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Custom Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(farmer.dynamicFields).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="font-medium">{String(value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
