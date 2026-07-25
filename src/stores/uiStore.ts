'use client';

import { create } from 'zustand';

export interface LoadingState {
  [key: string]: boolean;
}

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  loadingStates: LoadingState;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLoading: (key: string, loading: boolean) => void;
  getLoading: (key: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  theme: 'system',
  loadingStates: {},
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setLoading: (key, loading) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, [key]: loading },
    })),
  getLoading: (key) => get().loadingStates[key] || false,
}));
