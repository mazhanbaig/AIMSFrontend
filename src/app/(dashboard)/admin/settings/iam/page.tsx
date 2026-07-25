'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { iamApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { withAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

const ALL_PERMISSIONS = [
  'claims:read', 'claims:write', 'claims:approve', 'claims:assign',
  'farmers:read', 'farmers:write',
  'policies:read', 'policies:write',
  'staff:read', 'staff:write',
  'settings:read', 'settings:write',
  'billing:read', 'billing:write',
  'reports:read',
];

function IAMPage() {
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<any>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['iam-roles'],
    queryFn: () => iamApi.listRoles(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => iamApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iam-roles'] });
      toast.success('Role created');
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error('Failed to create role'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => iamApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iam-roles'] });
      toast.success('Role updated');
      setOpen(false);
      setEditRole(null);
      resetForm();
    },
    onError: () => toast.error('Failed to update role'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => iamApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iam-roles'] });
      toast.success('Role deleted');
    },
    onError: () => toast.error('Failed to delete role'),
  });

  const roles = data?.data || [];

  const resetForm = () => {
    setRoleName('');
    setRoleDescription('');
    setSelectedPerms([]);
  };

  const openEdit = (role: any) => {
    setEditRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setSelectedPerms(role.permissions || []);
    setOpen(true);
  };

  const openCreate = () => {
    setEditRole(null);
    resetForm();
    setOpen(true);
  };

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = () => {
    if (!roleName.trim()) { toast.error('Role name is required'); return; }
    const data = { name: roleName.trim(), description: roleDescription.trim(), permissions: selectedPerms };
    if (editRole) {
      updateMutation.mutateAsync({ id: editRole.id, data });
    } else {
      createMutation.mutateAsync(data);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading roles..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IAM & Roles</h1>
          <p className="text-muted-foreground mt-1">Manage roles, permissions, and access control</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input id="roleName" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Claims Manager" />
              </div>
              <div>
                <Label htmlFor="roleDesc">Description</Label>
                <Input id="roleDesc" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} placeholder="What this role can do" />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(perm)}
                        onChange={() => togglePerm(perm)}
                        className="rounded border-gray-300"
                      />
                      {perm.replace(':', ' ')}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {roles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No custom roles configured
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role: any) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{role.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(role)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      if (confirm(`Delete role "${role.name}"?`)) deleteMutation.mutateAsync(role.id);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {role.description && (
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {(role.permissions || []).map((perm: string) => (
                    <Badge key={perm} variant="secondary" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(IAMPage, ['TENANT_ADMIN']);
