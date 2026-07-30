'use client';

import { useCallback, useEffect } from 'react';
import { useTenantStore } from '@/stores/tenantStore';
import { getTenantSlug } from '@/lib/tenant';
import { platformApi } from '@/lib/api-client';

export function useTenant() {
  const { currentTenant, isLoading, setCurrentTenant, setLoading } = useTenantStore();

  const fetchTenant = useCallback(async () => {
    const slug = getTenantSlug();
    if (!slug) return;

    setLoading(true);
    try {
      // Fetch tenant details by slug
      const response = await platformApi.listTenants({ slug });
      const body = response.data;
      const tenants = body.items || body.data || [];
      if (Array.isArray(tenants) && tenants.length > 0) {
        setCurrentTenant(tenants[0]);
      }
    } catch {
      // Tenant fetch failed - may not have access
      setCurrentTenant(null);
    } finally {
      setLoading(false);
    }
  }, [setCurrentTenant, setLoading]);

  useEffect(() => {
    fetchTenant();
  }, [fetchTenant]);

  return {
    tenant: currentTenant,
    tenantSlug: getTenantSlug(),
    isLoading,
    refetch: fetchTenant,
  };
}
