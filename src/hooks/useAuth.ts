'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LoginInput, RegisterInput } from '@/types';
import { authApi } from '@/lib/api-client';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const { user, setUser, logout: storeLogout, isAuthenticated } = useAuthStore();

  // Sync session with auth store
  useEffect(() => {
    if (session?.user) {
      setUser(session.user as any);
    } else if (status === 'unauthenticated') {
      storeLogout();
    }
  }, [session, status, setUser, storeLogout]);

  const login = useCallback(
    async (data: LoginInput) => {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    },
    []
  );

  const register = useCallback(
    async (data: RegisterInput & { userType: string }) => {
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.userType,
        tenantSlug: data.tenantSlug,
      });

      // Auto-login after registration
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      return response.data;
    },
    []
  );

  const logout = useCallback(async () => {
    storeLogout();
    await signOut({ redirect: true, callbackUrl: '/login' });
  }, [storeLogout]);

  const updateProfile = useCallback(
    async (data: any) => {
      const response = await authApi.updateProfile(data);
      setUser({ ...user, ...response.data.data } as any);
      return response.data;
    },
    [user, setUser]
  );

  return {
    user,
    session,
    status,
    isAuthenticated,
    isLoading: status === 'loading',
    login,
    register,
    logout,
    updateProfile,
    update,
  };
}
