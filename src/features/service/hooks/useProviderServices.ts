/**
 * useProviderServices Hook
 *
 * Fetches and manages the current provider's services list.
 */
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { fetchProviderServices, deleteProviderService } from '../services/service.service';
import type { ServiceItem } from '../types';
import { VI } from '@/shared/i18n/vi';

interface UseProviderServicesResult {
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deletingId: number | null;
  removeService: (serviceId: number) => Promise<boolean>;
}

export function useProviderServices(
  providerId: number
): UseProviderServicesResult {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    if (!providerId || providerId === 0) {
      console.log("[useProviderServices] providerId is 0 or null, skipping fetch");
      setServices([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("[useProviderServices] fetching services for providerId:", providerId);
      const data = await fetchProviderServices(providerId);
      console.log("[useProviderServices] received services:", data);
      setServices(data);
    } catch (err) {
      console.error('[useProviderServices] fetch error:', err);
      setError(VI.service.list.messages.loadError);
      message.error(VI.service.list.messages.loadError);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  // Fetch on mount and whenever providerId changes
  useEffect(() => {
    refetch();
  }, [refetch]);

  const removeService = useCallback(
    async (serviceId: number): Promise<boolean> => {
      try {
        setDeletingId(serviceId);
        await deleteProviderService(serviceId);
        message.success(VI.service.list.messages.deleteSuccess);
        await refetch();
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : VI.service.list.messages.deleteError;
        message.error(msg);
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [refetch],
  );

  return { services, loading, error, refetch, deletingId, removeService };
}
