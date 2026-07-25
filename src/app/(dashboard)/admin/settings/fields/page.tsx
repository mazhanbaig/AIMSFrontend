'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantFieldApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { withAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

function CustomFieldsPage() {
  const queryClient = useQueryClient();
  const [newField, setNewField] = useState({
    fieldKey: '',
    label: '',
    fieldType: 'text',
    required: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-fields'],
    queryFn: () => tenantFieldApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tenantFieldApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-fields'] });
      toast.success('Field deleted');
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => tenantFieldApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-fields'] });
      setNewField({ fieldKey: '', label: '', fieldType: 'text', required: false });
      toast.success('Field created');
    },
  });

  const fields = data?.data || [];

  if (isLoading) return <LoadingSpinner size="lg" text="Loading fields..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Custom Fields</h1>
        <p className="text-muted-foreground mt-1">
          Manage dynamic form fields for farmer profiles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Fields ({fields.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No custom fields yet</p>
          ) : (
            <div className="space-y-2">
              {fields.map((field: any) => (
                <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div>
                      <p className="text-sm font-medium">{field.label}</p>
                      <p className="text-xs text-muted-foreground font-mono">{field.fieldKey}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{field.fieldType}</Badge>
                    {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(field.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Field</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Field Key</Label>
              <Input
                placeholder="e.g., farm_size"
                value={newField.fieldKey}
                onChange={(e) => setNewField({ ...newField, fieldKey: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="e.g., Farm Size"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select
                value={newField.fieldType}
                onValueChange={(v) => setNewField({ ...newField, fieldType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-8">
              <Switch
                checked={newField.required}
                onCheckedChange={(v) => setNewField({ ...newField, required: v })}
              />
              <Label>Required</Label>
            </div>
          </div>
          <Button
            onClick={() => createMutation.mutate(newField)}
            disabled={!newField.fieldKey || !newField.label}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CustomFieldsPage, ['TENANT_ADMIN']);
