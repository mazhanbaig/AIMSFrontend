'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimApi, documentApi } from '@/lib/api-client';
import { CreateClaimInput, UpdateClaimStatusInput, AssignClaimInput } from '@/types';
import toast from 'react-hot-toast';

export function useClaims(params?: any) {
  return useQuery({
    queryKey: ['claims', params],
    queryFn: async () => {
      const response = await claimApi.list(params);
      return response.data;
    },
  });
}

export function useAllClaims(params?: any) {
  return useQuery({
    queryKey: ['claims', 'all', params],
    queryFn: async () => {
      const response = await claimApi.listAll(params);
      return response.data;
    },
  });
}

export function useClaim(id: string) {
  return useQuery({
    queryKey: ['claim', id],
    queryFn: async () => {
      const response = await claimApi.get(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useFraudAnalysis(id: string) {
  return useQuery({
    queryKey: ['claim', id, 'fraud'],
    queryFn: async () => {
      const response = await claimApi.getFraudAnalysis(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClaimInput) => {
      const response = await claimApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit claim');
    },
  });
}

export function useUpdateClaimStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClaimStatusInput }) => {
      const response = await claimApi.updateStatus(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claim'] });
      toast.success('Claim status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
}

export function useAssignClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AssignClaimInput }) => {
      const response = await claimApi.assign(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign claim');
    },
  });
}

export function useClaimDocuments(claimId: string) {
  return useQuery({
    queryKey: ['claim-documents', claimId],
    queryFn: async () => {
      const response = await documentApi.list(claimId);
      return response.data;
    },
    enabled: !!claimId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await documentApi.upload(formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim-documents'] });
      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    },
  });
}
