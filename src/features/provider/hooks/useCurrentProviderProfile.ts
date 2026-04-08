/**
 * useCurrentProviderProfile Hook
 *
 * Fetches the current logged-in provider's profile using JWT userId.
 * Used by the provider settings/profile view page.
 */
import { useState, useEffect, useCallback } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getProviderByUserId } from '@/features/provider/api/provider.api';
import type { ProviderProfile } from '@/features/provider/types';

interface UseCurrentProviderProfileResult {
  provider: ProviderProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCurrentProviderProfile(): UseCurrentProviderProfileResult {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const userId = getUserId();
    console.log("[useCurrentProviderProfile] userId from JWT:", userId);
    if (!userId) {
      setError('Khong tim thay thong tin nguoi dung');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("[useCurrentProviderProfile] calling getProviderByUserId with:", userId);
      const data = await getProviderByUserId(userId);
      console.log("[useCurrentProviderProfile] provider data:", data);
      setProvider(data);
    } catch (err) {
      console.error('[useCurrentProviderProfile] fetch error:', err);
      setError('Khong the tai thong tin ho so');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { provider, loading, error, refetch };
}
