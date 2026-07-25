'use client';

import { useState } from 'react';
import { useLandParcels, useCreateLandParcel } from '@/hooks/useFarmers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Plus, Trash2, Wheat } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CreateLandParcelInput } from '@/types';
import toast from 'react-hot-toast';
import { landParcelApi } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';

export default function LandParcelsPage() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useLandParcels();
  const createParcel = useCreateLandParcel();

  const parcels = data?.data || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateLandParcelInput>();

  const onSubmit = async (formData: CreateLandParcelInput) => {
    await createParcel.mutateAsync(formData);
    setOpen(false);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this land parcel?')) return;
    try {
      await landParcelApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['land-parcels'] });
      toast.success('Land parcel deleted');
    } catch {
      toast.error('Failed to delete land parcel');
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading land parcels..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Land Parcels</h1>
          <p className="text-muted-foreground mt-1">Manage your registered land parcels</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Parcel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Land Parcel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Parcel Name</Label>
                <Input id="name" {...register('name', { required: 'Required' })} placeholder="e.g. North Field" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input id="size" type="number" step="0.01" {...register('size', { required: 'Required', valueAsNumber: true })} />
                  {errors.size && <p className="text-xs text-destructive mt-1">{errors.size.message}</p>}
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <select id="unit" {...register('unit', { required: 'Required' })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="ACRES">Acres</option>
                    <option value="HECTARES">Hectares</option>
                    <option value="SQ_METERS">Sq Meters</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location', { required: 'Required' })} placeholder="e.g. Punjab, Pakistan" />
                {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
              </div>
              <div>
                <Label htmlFor="cropType">Crop Type (optional)</Label>
                <Input id="cropType" {...register('cropType')} placeholder="e.g. Wheat, Rice" />
              </div>
              <div>
                <Label htmlFor="soilType">Soil Type (optional)</Label>
                <Input id="soilType" {...register('soilType')} placeholder="e.g. Loamy" />
              </div>
              <Button type="submit" className="w-full" disabled={createParcel.isPending}>
                {createParcel.isPending ? 'Adding...' : 'Add Parcel'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {parcels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No land parcels registered</p>
            <p className="text-sm mt-1">Add your first land parcel to purchase policies</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {parcels.map((parcel: any) => (
            <Card key={parcel.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{parcel.name}</CardTitle>
                  </div>
                  <Badge variant={parcel.isActive ? 'success' : 'secondary'}>
                    {parcel.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{parcel.size} {parcel.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{parcel.location}</span>
                </div>
                {parcel.cropType && (
                  <div className="flex items-center gap-2 text-sm">
                    <Wheat className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{parcel.cropType}</span>
                  </div>
                )}
                {parcel.soilType && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Soil:</span>
                    <span className="font-medium">{parcel.soilType}</span>
                  </div>
                )}
                <div className="pt-2 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(parcel.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
