'use client';

import { create } from 'zustand';
import { Tenant } from '@/types';

interface TenantState {
  currentTenant: Tenant | null;
  isLoading: boolean;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setLoading: (loading: boolean) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  currentTenant: null,
  isLoading: false,
  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearTenant: () => set({ currentTenant: null }),
}));
