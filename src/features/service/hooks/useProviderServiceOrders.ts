/**
 * Provider Service Orders Hook
 *
 * Fetches and filters service orders from the provider perspective.
 * Uses server-side filtering via the `statuses` query param.
 *
 * Keeps all orders in a separate state so counts stay correct regardless
 * of the currently active filter tab.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useMemo } from 'react';
import { message } from 'antd';
import { setWaitingStatus, fetchProviderServiceOrders, startService } from '../services/serviceOrder.service';
import { completeService } from '../services/serviceOrder.service';
import type { ServiceOrder } from '../api/booking.api';
import { getUserById } from '@/features/admin/api/adminUsers.api';
import { canFetchOtherUserProfiles } from '@/shared/utils/canFetchUserProfile';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import {
  DATA_SYNC_EVENTS,
  notifyServiceOrdersChanged,
} from '@/shared/sync/dataSync';
import type { OrderStatusValue } from '@/constants/orderStatus';

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
  tabCounts: Record<ProviderServiceOrderTab, number>;
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
  const selectedStatusRef = useRef(selectedStatus);
  selectedStatusRef.current = selectedStatus;

  const patchOrderStatus = useCallback(
    (orderId: number, status: OrderStatusValue) => {
      const patch = (list: ServiceOrder[]) =>
        list.map((o) => (o.id === orderId ? { ...o, status } : o));
      setAllOrders((prev) => patch(prev));
      setFilteredOrders((prev) => patch(prev));
      notifyServiceOrdersChanged({ orderId });
    },
    [],
  );

  const fetchData = useCallback(async (status?: ProviderServiceOrderTab) => {
    try {
      setLoading(true);
      setError(null);
      const apiStatuses = status && status !== 'all' ? status : undefined;
      let data = await fetchProviderServiceOrders(apiStatuses);

      if (canFetchOtherUserProfiles()) {
        const ordersNeedingName = data.filter((o) => !o.cosplayerName?.trim());
        if (ordersNeedingName.length > 0) {
          const uniqueCosplayerIds = [...new Set(ordersNeedingName.map((o) => o.cosplayerId))];
          const userResults = await Promise.all(
            uniqueCosplayerIds.map((id) => getUserById(id)),
          );
          const cosplayerMap = Object.fromEntries(
            userResults
              .filter((u): u is NonNullable<typeof u> => u !== null)
              .map((u) => [u.id, u.fullName ?? '—']),
          );
          data = data.map((order) =>
            !order.cosplayerName?.trim()
              ? { ...order, cosplayerName: cosplayerMap[order.cosplayerId] ?? order.cosplayerName }
              : order,
          );
        }
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

  const refreshAfterMutation = useCallback(async () => {
    await fetchData();
    const tab = selectedStatusRef.current;
    if (tab !== 'all') {
      await fetchData(tab);
    }
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(selectedStatus === 'all' ? undefined : selectedStatus);
  }, [fetchData, selectedStatus]);

  useDataSyncRefetch(refetch, DATA_SYNC_EVENTS.SERVICE_ORDERS_CHANGED);

  const handleSetWaitingStatus = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await setWaitingStatus(orderId);
        patchOrderStatus(orderId, 'WAITING_SERVICE_DATE');
        await refreshAfterMutation();
        message.success('Đã chuyển sang chờ ngày thực hiện');
      } catch (err: any) {
        console.error('[useProviderServiceOrders] setWaitingStatus failed:', err);
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
      } finally {
        setLoadingAction(null);
      }
    },
    [patchOrderStatus, refreshAfterMutation]
  );

  const handleStartService = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await startService(orderId);
        patchOrderStatus(orderId, 'IN_SERVICE');
        await refreshAfterMutation();
        message.success('Đã bắt đầu dịch vụ');
      } catch (err: any) {
        console.error('[useProviderServiceOrders] startService failed:', err);
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
      } finally {
        setLoadingAction(null);
      }
    },
    [patchOrderStatus, refreshAfterMutation]
  );

  const handleCompleteService = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await completeService(orderId);
        patchOrderStatus(orderId, 'COMPLETED');
        await refreshAfterMutation();
        message.success('Đã hoàn thành dịch vụ');
      } catch (err: any) {
        console.error('[useProviderServiceOrders] completeService failed:', err);
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
      } finally {
        setLoadingAction(null);
      }
    },
    [patchOrderStatus, refreshAfterMutation]
  );

  // Return allOrders for counts, filteredOrders for display
  const orders = selectedStatus === 'all' ? allOrders : filteredOrders;
  const tabCounts = useMemo<Record<ProviderServiceOrderTab, number>>(() => {
    const countByStatus = (status: ProviderServiceOrderTab) =>
      allOrders.filter((o) => o.status === status).length;
    return {
      all: allOrders.length,
      UNCONFIRM: countByStatus('UNCONFIRM'),
      UNPAID: countByStatus('UNPAID'),
      PAID: countByStatus('PAID'),
      WAITING_SERVICE_DATE: countByStatus('WAITING_SERVICE_DATE'),
      IN_SERVICE: countByStatus('IN_SERVICE'),
      COMPLETED: countByStatus('COMPLETED'),
      DISPUTE: countByStatus('DISPUTE'),
      CANCELLED: countByStatus('CANCELLED'),
    };
  }, [allOrders]);

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
    tabCounts,
  };
}