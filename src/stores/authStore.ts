'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role as UserRole);
      },
      hasPermission: (_permission: string) => {
        const { user } = get();
        if (!user) return false;
        // Platform admins have all permissions
        if (user.role === 'PLATFORM_ADMIN') return true;
        // Tenant admins have all tenant-level permissions
        if (user.role === 'TENANT_ADMIN') return true;
        // For other roles, check permissions from the backend
        return true; // Backend handles permission enforcement
      },
    }),
    {
      name: 'aims-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
