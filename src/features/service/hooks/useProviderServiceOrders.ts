/**
 * Provider Service Orders Hook
 *
 * Fetches and filters service orders from the provider perspective.
 * Uses server-side filtering via the `statuses` query param.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProviderServiceOrders } from '../services/serviceOrder.service';
import type { ServiceOrder } from '../api/booking.api';

export type ProviderServiceOrderTab =
  | 'all'
  | 'UNCONFIRM'
  | 'UNPAID'
  | 'PAID'
  | 'WAITING_SERVICE_DATE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'DISPUTE'
  | 'CANCELLED';

export interface ProviderServiceOrderCounts {
  all: number;
  UNCONFIRM: number;
  UNPAID: number;
  PAID: number;
  WAITING_SERVICE_DATE: number;
  IN_SERVICE: number;
  COMPLETED: number;
  DISPUTE: number;
  CANCELLED: number;
}

export interface UseProviderServiceOrdersResult {
  orders: ServiceOrder[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedStatus: ProviderServiceOrderTab;
  setStatus: (status: ProviderServiceOrderTab) => void;
}

export function useProviderServiceOrders(): UseProviderServiceOrdersResult {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProviderServiceOrderTab>('all');

  const fetchData = useCallback(async (status?: ProviderServiceOrderTab) => {
    try {
      setLoading(true);
      setError(null);
      const apiStatuses = status && status !== 'all' ? status : undefined;
      const data = await fetchProviderServiceOrders(apiStatuses);
      // Sort by createdAt DESC
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (err) {
      console.error('[useProviderServiceOrders] Failed to fetch orders:', err);
      setError('Không thể tải danh sách đơn đặt dịch vụ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetStatus = useCallback(
    (status: ProviderServiceOrderTab) => {
      setSelectedStatus(status);
      fetchData(status);
    },
    [fetchData]
  );

  const refetch = useCallback(async () => {
    await fetchData(selectedStatus);
  }, [fetchData, selectedStatus]);

  // Calculate counts for each status tab
  const counts = useMemo(() => {
    const countByStatus = (status: string) =>
      orders.filter((order) => order.status === status).length;

    return {
      all: orders.length,
      UNCONFIRM: countByStatus('UNCONFIRM'),
      UNPAID: countByStatus('UNPAID'),
      PAID: countByStatus('PAID'),
      WAITING_SERVICE_DATE: countByStatus('WAITING_SERVICE_DATE'),
      IN_SERVICE: countByStatus('IN_SERVICE'),
      COMPLETED: countByStatus('COMPLETED'),
      DISPUTE: countByStatus('DISPUTE'),
      CANCELLED: countByStatus('CANCELLED'),
    };
  }, [orders]);

  return {
    orders,
    loading,
    error,
    refetch,
    selectedStatus,
    setStatus: handleSetStatus,
  };
}