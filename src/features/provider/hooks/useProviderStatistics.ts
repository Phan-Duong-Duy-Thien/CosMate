/**
 * Hook for provider dashboard statistics.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProviderStatistics, type ProviderStatistics } from '../api/provider.api';
import { getProviderIdFromAuth } from '../utils/providerAuth';

interface UseProviderStatisticsResult {
  statistics: ProviderStatistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  providerId: number | null;
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
