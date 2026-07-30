'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  setUser: (user: User | null) => void;
  setPermissions: (permissions: string[]) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      permissions: [],
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => set({ user: null, isAuthenticated: false, permissions: [] }),
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role as UserRole);
      },
      hasPermission: (permission: string) => {
        const { user, permissions } = get();
        if (!user) return false;
        if (user.role === 'PLATFORM_ADMIN') return true;
        if (user.role === 'TENANT_ADMIN') return true;
        return permissions.includes(permission);
      },
    }),
    {
      name: 'aims-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);
