/**
 * usePublicProviderServices Hook
 *
 * Fetches services for a specific provider (by providerId).
 * Used by public profile pages (PhotographerProfilePage, StaffProfilePage).
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchProviderServices } from '../services/service.service';
import type { ServiceItem } from '../types';

interface UsePublicProviderServicesResult {
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePublicProviderServices(
  providerId: number | undefined
): UsePublicProviderServicesResult {
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
      console.error('[usePublicProviderServices] fetch error:', err);
      setError('Không thể tải danh sách dịch vụ.');
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { services, loading, error, refetch };
}
