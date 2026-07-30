'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getInitials, formatDate } from '@/lib/utils';
import { SessionUser } from '@/types';
import { User, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const user = session?.user as SessionUser | undefined;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (data: { name: string; phone?: string }) => authApi.updateProfile(data),
    onSuccess: async () => {
      await updateSession();
      queryClient.invalidateQueries({ queryKey: ['farmer', 'profile'] });
      toast.success('Profile updated successfully');
      setEditing(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error((error as any).response?.data?.message || 'Failed to update profile');
    },
  });

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings</p>
        </div>
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditing(false); setName(user?.name || ''); setPhone(user?.phone || ''); }}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={() => updateProfile.mutateAsync({ name, phone })} disabled={updateProfile.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateProfile.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(user.name || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1">
                {user.role?.replace('_', ' ') || 'Unknown'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{user.role?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tenant ID</p>
                <p className="font-medium font-mono text-sm">{user.tenantId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-medium font-mono text-sm">{user.id}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
