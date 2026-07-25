'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Phone, CalendarDays } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';

interface FarmerCardProps {
  farmer: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    isVerified?: boolean;
    createdAt?: string;
    _count?: {
      landParcels?: number;
      policies?: number;
      claims?: number;
    };
  };
  onClick?: () => void;
}

export function FarmerCard({ farmer, onClick }: FarmerCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(farmer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{farmer.name}</CardTitle>
            {farmer.phone && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {farmer.phone}
              </p>
            )}
          </div>
          <Badge variant={farmer.isVerified ? 'success' : 'secondary'}>
            {farmer.isVerified ? 'Verified' : 'Unverified'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {(farmer.address || farmer.city) && (
            <p className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {[farmer.address, farmer.city, farmer.state].filter(Boolean).join(', ')}
            </p>
          )}
          {farmer.createdAt && (
            <p className="flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              Joined {formatDate(farmer.createdAt)}
            </p>
          )}
          {farmer._count && (
            <div className="flex gap-4 mt-2 pt-2 border-t">
              <span className="text-muted-foreground">
                <strong>{farmer._count.landParcels || 0}</strong> Parcels
              </span>
              <span className="text-muted-foreground">
                <strong>{farmer._count.policies || 0}</strong> Policies
              </span>
              <span className="text-muted-foreground">
                <strong>{farmer._count.claims || 0}</strong> Claims
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
