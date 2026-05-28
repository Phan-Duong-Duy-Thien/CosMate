/**
 * useEditService — loads full service detail for the edit modal.
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { fetchServiceById } from '../services/service.service';
import type { ServiceItem } from '../types';
import { VI } from '@/shared/i18n/vi';

interface UseEditServiceResult {
  editingService: ServiceItem | null;
  loading: boolean;
  error: string | null;
  open: (serviceId: number) => void;
  close: () => void;
}

export function useEditService(): UseEditServiceResult {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(async (serviceId: number) => {
    setLoading(true);
    setError(null);
    setEditingService(null);
    try {
      const data = await fetchServiceById(serviceId);
      setEditingService(data);
    } catch (err) {
      console.error('[useEditService] fetch error:', err);
      const msg = VI.service.list.detail.loadError;
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const close = useCallback(() => {
    setEditingService(null);
    setError(null);
  }, []);

  return { editingService, loading, error, open, close };
}
