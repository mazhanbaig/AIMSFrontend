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
                <Label htmlFor="landTitleNumber">Parcel Title</Label>
                <Input id="landTitleNumber" {...register('landTitleNumber')} placeholder="e.g. North Field" />
              </div>
              <div>
                <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                <Input id="address" {...register('address', { required: 'Required' })} placeholder="e.g. Punjab, Pakistan" />
                {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="areaAcres">Area (Acres) <span className="text-destructive">*</span></Label>
                <Input id="areaAcres" type="number" step="0.01" {...register('areaAcres', { required: 'Required', valueAsNumber: true })} />
                {errors.areaAcres && <p className="text-xs text-destructive mt-1">{errors.areaAcres.message}</p>}
              </div>
              <div>
                <Label htmlFor="cropType">Crop Type <span className="text-destructive">*</span></Label>
                <Input id="cropType" {...register('cropType', { required: 'Required' })} placeholder="e.g. Wheat, Rice" />
                {errors.cropType && <p className="text-xs text-destructive mt-1">{errors.cropType.message}</p>}
              </div>
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
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
                    <CardTitle className="text-base">{parcel.landTitleNumber || parcel.address}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">{parcel.areaAcres} acres</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium">{parcel.address}</span>
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
