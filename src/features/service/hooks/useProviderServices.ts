/**
 * useProviderServices Hook
 *
 * Fetches and manages the current provider's services list.
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { fetchProviderServices } from '../services/service.service';
import type { ServiceItem } from '../types';
import { VI } from '@/shared/i18n/vi';

interface UseProviderServicesResult {
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProviderServices(
  providerId: number
): UseProviderServicesResult {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!providerId || providerId === 0) {
      setServices([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProviderServices(providerId);
      setServices(data);
    } catch (err) {
      console.error('[useProviderServices] fetch error:', err);
      setError(VI.service.list.messages.loadError);
      message.error(VI.service.list.messages.loadError);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  return { services, loading, error, refetch };
}
