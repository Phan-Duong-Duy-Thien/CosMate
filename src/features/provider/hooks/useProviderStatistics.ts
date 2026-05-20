/**
 * Hook for provider dashboard statistics.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProviderStatistics, type ProviderStatistics } from '../api/provider.api';
import { getAuth } from '@/features/auth/services/tokenStorage';

interface UseProviderStatisticsResult {
  statistics: ProviderStatistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  providerId: number | null;
}

function getProviderIdFromAuth(): number | null {
  const auth = getAuth();
  if (!auth?.token) return null;

  try {
    const parts = auth.token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    const id = decoded?.providerId ?? decoded?.provider_id ?? null;
    return typeof id === 'number' ? id : null;
  } catch {
    return null;
  }
}

export function useProviderStatistics(months = 6): UseProviderStatisticsResult {
  const [statistics, setStatistics] = useState<ProviderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const providerId = useMemo(() => getProviderIdFromAuth(), []);

  const refetch = useCallback(async () => {
    if (!providerId) {
      setError('Không tìm thấy thông tin provider. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getProviderStatistics(providerId, months);
      setStatistics(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải thống kê';
      setError(message);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, [providerId, months]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { statistics, loading, error, refetch, providerId };
}
