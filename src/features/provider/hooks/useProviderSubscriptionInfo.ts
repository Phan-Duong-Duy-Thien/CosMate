/**
 * Fetches provider subscription summary for package management and header badge.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProviderSubscriptionInfo } from '../api/subscription.api';
import { getProviderIdFromAuth } from '../utils/providerAuth';
import type { ProviderSubscriptionInfo } from '../types';

interface UseProviderSubscriptionInfoResult {
  info: ProviderSubscriptionInfo | null;
  loading: boolean;
  error: string | null;
  providerId: number | null;
  refetch: () => Promise<void>;
}

export function useProviderSubscriptionInfo(): UseProviderSubscriptionInfoResult {
  const [info, setInfo] = useState<ProviderSubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const providerId = useMemo(() => getProviderIdFromAuth(), []);

  const refetch = useCallback(async () => {
    if (!providerId) {
      setError('Không tìm thấy thông tin provider. Vui lòng đăng nhập lại.');
      setInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getProviderSubscriptionInfo(providerId);
      setInfo(data);
    } catch (err) {
      setInfo(null);
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin gói dịch vụ.');
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { info, loading, error, providerId, refetch };
}
