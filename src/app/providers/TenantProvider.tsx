'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTenantSlug } from '@/lib/tenant';
import { useTenantStore } from '@/stores/tenantStore';
import { Tenant } from '@/types';

interface TenantContextType {
  tenantSlug: string | null;
  tenant: Tenant | null;
  isLoading: boolean;
  tenantId: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenantSlug: null,
  tenant: null,
  isLoading: true,
  tenantId: null,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTenant, isLoading: storeLoading } = useTenantStore();

  useEffect(() => {
    const slug = getTenantSlug();
    setTenantSlug(slug);

    if (currentTenant?.id) {
      setTenantId(currentTenant.id);
    }

    setIsLoading(false);
  }, [currentTenant]);

  return (
    <TenantContext.Provider
      value={{
        tenantSlug,
        tenant: currentTenant,
        isLoading: isLoading || storeLoading,
        tenantId,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export const useTenantContext = () => useContext(TenantContext);
