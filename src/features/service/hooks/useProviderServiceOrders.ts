/**
 * Provider Service Orders Hook
 *
 * Fetches and filters service orders from the provider perspective.
 * Uses server-side filtering via the `statuses` query param.
 *
 * Keeps all orders in a separate state so counts stay correct regardless
 * of the currently active filter tab.
 */
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { setWaitingStatus, fetchProviderServiceOrders, startService } from '../services/serviceOrder.service';
import { completeService } from '../services/serviceOrder.service';
import type { ServiceOrder } from '../api/booking.api';
import { getUserById } from '@/features/admin/api/adminUsers.api';

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

export interface UseProviderServiceOrdersResult {
  orders: ServiceOrder[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedStatus: ProviderServiceOrderTab;
  setStatus: (status: ProviderServiceOrderTab) => void;
  setWaitingStatus: (orderId: number) => Promise<void>;
  startService: (orderId: number) => Promise<void>;
  completeService: (orderId: number) => Promise<void>;
  loadingAction: number | null;
}

export function useProviderServiceOrders(): UseProviderServiceOrdersResult {
  // allOrders — always holds the complete unfiltered list (used for tab counts)
  const [allOrders, setAllOrders] = useState<ServiceOrder[]>([]);
  // filteredOrders — only the orders matching the selected tab (used for display)
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProviderServiceOrderTab>('all');
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const fetchData = useCallback(async (status?: ProviderServiceOrderTab) => {
    try {
      setLoading(true);
      setError(null);
      const apiStatuses = status && status !== 'all' ? status : undefined;
      let data = await fetchProviderServiceOrders(apiStatuses);

      // Batch resolve missing cosplayerName from cosplayerId
      const ordersNeedingName = data.filter((o) => !o.cosplayerName);
      if (ordersNeedingName.length > 0) {
        const uniqueCosplayerIds = [...new Set(ordersNeedingName.map((o) => o.cosplayerId))];
        const userResults = await Promise.all(
          uniqueCosplayerIds.map((id) => getUserById(id).catch(() => null))
        );
        const cosplayerMap = Object.fromEntries(
          userResults
            .filter((u): u is NonNullable<typeof u> => u !== null)
            .map((u) => [u.id, u.fullName ?? '—'])
        );
        data = data.map((order) => {
          if (!order.cosplayerName) {
            return { ...order, cosplayerName: cosplayerMap[order.cosplayerId] ?? order.cosplayerName };
          }
          return order;
        });
      }

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (!apiStatuses) {
        // No filter → this IS the full list for counts
        setAllOrders(sorted);
        setFilteredOrders(sorted);
      } else {
        // Filtered response → keep allOrders intact, update display only
        setFilteredOrders(sorted);
      }
    } catch (err) {
      console.error('[useProviderServiceOrders] Failed to fetch orders:', err);
      setError('Không thể tải danh sách đơn đặt dịch vụ');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all orders on mount (no filter) for correct counts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetStatus = useCallback(
    (status: ProviderServiceOrderTab) => {
      setSelectedStatus(status);
      if (status === 'all') {
        // Restore full list from stored allOrders
        setFilteredOrders(
          [...allOrders].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } else {
        fetchData(status);
      }
    },
    [fetchData, allOrders]
  );

  const refetch = useCallback(async () => {
    await fetchData(selectedStatus === 'all' ? undefined : selectedStatus);
  }, [fetchData, selectedStatus]);

  const handleSetWaitingStatus = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await setWaitingStatus(orderId);
        // Always refetch full list to keep allOrders + filteredOrders in sync
        await fetchData();
        message.success('Đã chuyển sang chờ ngày thực hiện');
      } catch (err: any) {
        console.error('[useProviderServiceOrders] setWaitingStatus failed:', err);
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
      } finally {
        setLoadingAction(null);
      }
    },
    [fetchData]
  );

  const handleStartService = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await startService(orderId);
        // Always refetch full list to keep allOrders + filteredOrders in sync
        await fetchData();
        message.success('Đã bắt đầu dịch vụ');
      } catch (err: any) {
        console.error('[useProviderServiceOrders] startService failed:', err);
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
      } finally {
        setLoadingAction(null);
      }
    },
    [fetchData]
  );

  const handleCompleteService = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await completeService(orderId);
        // Always refetch full list to keep allOrders + filteredOrders in sync
        await fetchData();
        message.success('Đã hoàn thành dịch vụ');
      } catch (err: any) {
        console.error('[useProviderServiceOrders] completeService failed:', err);
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
      } finally {
        setLoadingAction(null);
      }
    },
    [fetchData]
  );

  // Return allOrders for counts, filteredOrders for display
  const orders = selectedStatus === 'all' ? allOrders : filteredOrders;

  return {
    orders,
    loading,
    error,
    refetch,
    selectedStatus,
    setStatus: handleSetStatus,
    setWaitingStatus: handleSetWaitingStatus,
    startService: handleStartService,
    completeService: handleCompleteService,
    loadingAction,
  };
}