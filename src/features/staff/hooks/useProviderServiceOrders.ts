/**
 * Provider Service Orders Hook
 * Fetches and filters service orders for the provider (staff/photographer) side.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProviderServiceOrders } from '@/features/service/services/booking.service';
import type { ServiceOrder } from '@/features/service/api/booking.api';

export type ServiceOrderStatus =
  | 'all'
  | 'UNCONFIRM'
  | 'UNPAID'
  | 'PAID'
  | 'WAITING_SERVICE_DATE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'DISPUTE'
  | 'CANCELLED';

export interface ProviderServiceOrdersResult {
  orders: ServiceOrder[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedStatus: ServiceOrderStatus;
  setStatus: (status: ServiceOrderStatus) => void;
}

export function useProviderServiceOrders(): ProviderServiceOrdersResult {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ServiceOrderStatus>('all');

  const fetchData = useCallback(async (status?: ServiceOrderStatus) => {
    try {
      setLoading(true);
      setError(null);
      const apiStatuses = status && status !== 'all' ? status : undefined;
      const data = await fetchProviderServiceOrders(apiStatuses);
      setOrders(data);
    } catch (err) {
      console.error('[useProviderServiceOrders] Failed to fetch orders:', err);
      setError('Không thể tải danh sách đơn đặt dịch vụ.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetStatus = useCallback((status: ServiceOrderStatus) => {
    setSelectedStatus(status);
    fetchData(status);
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(selectedStatus);
  }, [fetchData, selectedStatus]);

  return {
    orders,
    loading,
    error,
    refetch,
    selectedStatus,
    setStatus: handleSetStatus,
  };
}