/**
 * useProvidersByRole Hook
 *
 * Fetches providers filtered by role for public listing pages.
 */
import { useState, useEffect, useCallback } from 'react';
import { getProvidersByRole } from '@/features/provider/api/providerShop.api';
import type { ProviderProfile } from '@/features/provider/types';

export const PROVIDER_ROLE = {
  PHOTOGRAPHER: 'PROVIDER_PHOTOGRAPH',
  EVENT_STAFF: 'PROVIDER_EVENT_STAFF',
} as const;

export type UseProvidersByRoleOptions = {
  /** When true, only providers with verified === true (subscription active). */
  verifiedOnly?: boolean;
};

interface UseProvidersByRoleResult {
  providers: ProviderProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProvidersByRole(
  roleName: (typeof PROVIDER_ROLE)[keyof typeof PROVIDER_ROLE],
  options?: UseProvidersByRoleOptions,
): UseProvidersByRoleResult {
  const verifiedOnly = options?.verifiedOnly ?? false;
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProvidersByRole(roleName);
      setProviders(verifiedOnly ? data.filter((p) => p.verified) : data);
    } catch (err) {
      console.error('[useProvidersByRole] fetch error:', err);
      setError('Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [roleName, verifiedOnly]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { providers, loading, error, refetch };
}
