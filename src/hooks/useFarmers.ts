'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmerApi, landParcelApi, tenantFieldApi } from '@/lib/api-client';
import { CreateFarmerInput, CreateLandParcelInput } from '@/types';
import toast from 'react-hot-toast';

export function useFarmers(params?: any) {
  return useQuery({
    queryKey: ['farmers', params],
    queryFn: async () => {
      const response = await farmerApi.list(params);
      return response.data;
    },
  });
}

export function useFarmerProfile() {
  return useQuery({
    queryKey: ['farmer', 'profile'],
    queryFn: async () => {
      const response = await farmerApi.getProfile();
      return response.data;
    },
  });
}

export function useFarmer(id: string) {
  return useQuery({
    queryKey: ['farmer', id],
    queryFn: async () => {
      const response = await farmerApi.get(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateFarmer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFarmerInput) => {
      const response = await farmerApi.createProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast.success('Farmer profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create farmer profile');
    },
  });
}

export function useUpdateFarmer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFarmerInput) => {
      const response = await farmerApi.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
      queryClient.invalidateQueries({ queryKey: ['farmer'] });
      toast.success('Farmer profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update farmer profile');
    },
  });
}

export function useTenantFields() {
  return useQuery({
    queryKey: ['tenant-fields'],
    queryFn: async () => {
      const response = await tenantFieldApi.list();
      return response.data;
    },
  });
}

// Land Parcels
export function useLandParcels(params?: any) {
  return useQuery({
    queryKey: ['land-parcels', params],
    queryFn: async () => {
      const response = await landParcelApi.list(params);
      return response.data;
    },
  });
}

export function useCreateLandParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLandParcelInput) => {
      const response = await landParcelApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['land-parcels'] });
      toast.success('Land parcel created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create land parcel');
    },
  });
}
