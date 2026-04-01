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
    if (!userId) {
      setError('Không tìm thấy thông tin người dùng');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getProviderByUserId(userId);
      setProvider(data);
    } catch (err) {
      console.error('[useCurrentProviderProfile] fetch error:', err);
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { provider, loading, error, refetch };
}
