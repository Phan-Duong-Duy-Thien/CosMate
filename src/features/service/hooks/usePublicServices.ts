/**
 * usePublicServices Hook
 *
 * Fetches and manages public services filtered by service type.
 * Used by photographer and staff listing pages.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchPublicServices } from '../services/service.service';
import type { PublicServiceItem } from '../types';
import { SERVICE_TYPE } from '../types';

interface UsePublicServicesResult {
  services: PublicServiceItem[];
  filteredServices: PublicServiceItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePublicServices(
  serviceType: (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE]
): UsePublicServicesResult {
  const [services, setServices] = useState<PublicServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicServices();
      setServices(data);
    } catch (err) {
      console.error('[usePublicServices] fetch error:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => s.serviceType === serviceType);
  }, [services, serviceType]);

  return { services, filteredServices, loading, error, refetch };
}
