/**
 * useServiceDetail Hook
 *
 * Fetches a single service by its ID for the public detail page.
 * Also fetches provider userId for chat functionality.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchServiceById } from '../services/service.service';
import { getProviderById } from '@/features/provider/api/providerShop.api';
import type { ServiceItem } from '../types';

interface UseServiceDetailResult {
  service: (ServiceItem & { userId?: number }) | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useServiceDetail(
  serviceId: number | undefined
): UseServiceDetailResult {
  const [service, setService] = useState<(ServiceItem & { userId?: number }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!serviceId || serviceId === 0) {
      setService(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchServiceById(serviceId);
      // Fetch provider to get userId for chat
      try {
        const provider = await getProviderById(data.providerId);
        setService({ ...data, userId: provider.userId });
      } catch {
        // Provider fetch failed — still return service without userId
        setService(data);
      }
    } catch (err) {
      console.error('[useServiceDetail] fetch error:', err);
      setError('Không thể tải chi tiết dịch vụ.');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { service, loading, error, refetch };
}
