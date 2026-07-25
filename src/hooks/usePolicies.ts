'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policyApi, policyPlanApi } from '@/lib/api-client';
import { PurchasePolicyInput, QuoteInput } from '@/types';
import toast from 'react-hot-toast';

export function usePolicies(params?: any) {
  return useQuery({
    queryKey: ['policies', params],
    queryFn: async () => {
      const response = await policyApi.list(params);
      return response.data;
    },
  });
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      const response = await policyApi.get(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePolicyPlans(params?: any) {
  return useQuery({
    queryKey: ['policy-plans', params],
    queryFn: async () => {
      const response = await policyPlanApi.list(params);
      return response.data;
    },
  });
}

export function usePolicyPlan(id: string) {
  return useQuery({
    queryKey: ['policy-plan', id],
    queryFn: async () => {
      const response = await policyPlanApi.get(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePurchasePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PurchasePolicyInput) => {
      const response = await policyApi.purchase(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Policy purchased successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to purchase policy');
    },
  });
}

export function useQuote() {
  return useMutation({
    mutationFn: async (data: QuoteInput) => {
      const response = await policyPlanApi.quote(data);
      return response.data;
    },
  });
}
