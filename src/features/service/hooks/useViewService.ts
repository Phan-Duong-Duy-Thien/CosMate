/**
 * useViewService Hook
 *
 * Fetches service detail for the view modal.
 * Used by ProviderServiceListPage to open a service detail modal.
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { fetchServiceById } from '../services/service.service';
import type { ServiceItem } from '../types';
import { VI } from '@/shared/i18n/vi';

interface UseViewServiceResult {
  selectedServiceId: number | null;
  serviceDetail: ServiceItem | null;
  loading: boolean;
  error: string | null;
  open: (serviceId: number) => void;
  close: () => void;
}

export function useViewService(): UseViewServiceResult {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(async (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setLoading(true);
    setError(null);
    setServiceDetail(null);
    try {
      const data = await fetchServiceById(serviceId);
      setServiceDetail(data);
    } catch (err) {
      console.error('[useViewService] fetch error:', err);
      setError(VI.service.detail.loadError);
      message.error(VI.service.detail.loadError);
    } finally {
      setLoading(false);
    }
  }, []);

  const close = useCallback(() => {
    setSelectedServiceId(null);
    setServiceDetail(null);
    setError(null);
  }, []);

  return {
    selectedServiceId,
    serviceDetail,
    loading,
    error,
    open,
    close,
  };
}