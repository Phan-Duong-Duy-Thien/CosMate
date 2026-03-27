/**
 * useProviderProfile Hook
 *
 * Fetches provider profile by provider ID.
 * Used by public photographer/staff profile pages.
 */
import { useState, useEffect, useCallback } from 'react';
import { getProviderById } from '@/features/provider/api/providerShop.api';
import type { ProviderProfile } from '@/features/provider/types';

interface UseProviderProfileResult {
  provider: ProviderProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProviderProfile(providerId: number): UseProviderProfileResult {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProviderById(providerId);
      setProvider(data);
    } catch (err) {
      console.error('[useProviderProfile] fetch error:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    if (providerId) {
      refetch();
    }
  }, [providerId, refetch]);

  return { provider, loading, error, refetch };
}
