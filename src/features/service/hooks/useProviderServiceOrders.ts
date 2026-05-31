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
import { searchUsers } from '@/features/chat/api/user.api';
import { getOrCreateChatRoom, getChatPartner } from '@/features/chat/api/chat.api';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { canFetchOtherUserProfiles } from '@/shared/utils/canFetchUserProfile';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { usePendingListMutation } from '@/shared/hooks/usePendingListMutation';
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge';
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

function translateBackendError(msg?: string): string | undefined {
  if (!msg) return undefined;
  if (msg.includes('Booking date is in the future')) {
    return 'Chưa đến ngày hẹn đặt lịch, không thể bắt đầu thực hiện dịch vụ!';
  }
  return msg;
}

export function useProviderServiceOrders(): UseProviderServiceOrdersResult {
  const [allOrders, setAllOrders] = useState<ServiceOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProviderServiceOrderTab>('all');
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const selectedStatusRef = useRef(selectedStatus);
  selectedStatusRef.current = selectedStatus;

  const { mergeFetched, setPendingField } = usePendingListMutation<ServiceOrder, string>({
    getItemId: (o) => o.id,
    getFieldValue: (o) => o.status,
    setFieldValue: (o, status) => ({ ...o, status }),
  });

  const enrichOrders = useCallback(async (data: ServiceOrder[]) => {
    const ordersNeedingName = data.filter((o) => !o.cosplayerName?.trim());
    if (ordersNeedingName.length === 0) return data;
    const uniqueCosplayerIds = [...new Set(ordersNeedingName.map((o) => o.cosplayerId))];
    const currentUserId = getUserId();
    const userResults = await Promise.all(
      uniqueCosplayerIds.map(async (id) => {
        const direct = await getUserById(id);
        if (direct) return direct;
        if (currentUserId) {
          try {
            const room = await getOrCreateChatRoom(currentUserId, id);
            const partner = await getChatPartner(room.id, currentUserId);
            if (partner?.fullName) {
              return { id, fullName: partner.fullName } as any;
            }
          } catch {}
        }
        try {
          const list = await searchUsers(String(id));
          const found = list.find((u) => u.id === id);
          if (found) {
            return { id, fullName: found.fullName, username: found.username } as any;
          }
        } catch {}
        return null;
      })
    );
    const cosplayerMap = Object.fromEntries(
      userResults
        .filter((u): u is NonNullable<typeof u> => u !== null)
        .map((u) => [u.id, u.fullName ?? '—']),
    );
    return data.map((order) =>
      !order.cosplayerName?.trim()
        ? { ...order, cosplayerName: cosplayerMap[order.cosplayerId] ?? order.cosplayerName }
        : order,
    );
  }, []);

  const fetchData = useCallback(
    async (status?: ProviderServiceOrderTab, options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      try {
        if (!silent) {
          setLoading(true);
        }
        setError(null);
        const apiStatuses = status && status !== 'all' ? status : undefined;
        let data = await fetchProviderServiceOrders(apiStatuses);
        data = await enrichOrders(data);

        const sorted = mergeFetched(
          [...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );

        if (!apiStatuses) {
          setAllOrders(sorted);
          setFilteredOrders(sorted);
        } else {
          setFilteredOrders(sorted);
        }
      } catch (err) {
        console.error('[useProviderServiceOrders] Failed to fetch orders:', err);
        setError('Không thể tải danh sách đơn đặt dịch vụ');
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [enrichOrders, mergeFetched],
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const applyOrderStatusMutation = useCallback(
    (orderId: number, newStatus: OrderStatusValue) => {
      setPendingField(orderId, newStatus);
      const tab = selectedStatusRef.current;
      setAllOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      setFilteredOrders((prev) => {
        if (tab !== 'all' && newStatus !== tab) {
          return prev.filter((o) => o.id !== orderId);
        }
        return prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      });
      notifyServiceOrdersChanged({ orderId });
    },
    [setPendingField],
  );

  const scheduleSyncRefetch = useCallback(() => {
    scheduleBackgroundRefetch(async () => {
      await fetchData(undefined, { silent: true });
      const tab = selectedStatusRef.current;
      if (tab !== 'all') {
        await fetchData(tab, { silent: true });
      }
    });
  }, [fetchData]);

  const handleSetStatus = useCallback(
    (status: ProviderServiceOrderTab) => {
      setSelectedStatus(status);
      if (status === 'all') {
        setFilteredOrders(
          [...allOrders].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      } else {
        void fetchData(status);
      }
    },
    [fetchData, allOrders],
  );

  const refetch = useCallback(async () => {
    await fetchData(selectedStatus === 'all' ? undefined : selectedStatus);
  }, [fetchData, selectedStatus]);

  useDataSyncRefetch(() => refetch(), DATA_SYNC_EVENTS.SERVICE_ORDERS_CHANGED);

  const handleSetWaitingStatus = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await setWaitingStatus(orderId);
        applyOrderStatusMutation(orderId, 'WAITING_SERVICE_DATE');
        scheduleSyncRefetch();
        message.success('Đã chuyển sang chờ ngày thực hiện');
      } catch (err: unknown) {
        console.error('[useProviderServiceOrders] setWaitingStatus failed:', err);
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : err instanceof Error
            ? err.message
            : undefined;
        message.error(translateBackendError(msg) || 'Có lỗi xảy ra');
        throw err;
      } finally {
        setLoadingAction(null);
      }
    },
    [applyOrderStatusMutation, scheduleSyncRefetch],
  );

  const handleStartService = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await startService(orderId);
        applyOrderStatusMutation(orderId, 'IN_SERVICE');
        scheduleSyncRefetch();
        message.success('Đã bắt đầu dịch vụ');
      } catch (err: unknown) {
        console.error('[useProviderServiceOrders] startService failed:', err);
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : err instanceof Error
            ? err.message
            : undefined;
        message.error(translateBackendError(msg) || 'Có lỗi xảy ra');
        throw err;
      } finally {
        setLoadingAction(null);
      }
    },
    [applyOrderStatusMutation, scheduleSyncRefetch],
  );

  const handleCompleteService = useCallback(
    async (orderId: number) => {
      try {
        setLoadingAction(orderId);
        await completeService(orderId);
        applyOrderStatusMutation(orderId, 'COMPLETED');
        scheduleSyncRefetch();
        message.success('Đã hoàn thành dịch vụ');
      } catch (err: unknown) {
        console.error('[useProviderServiceOrders] completeService failed:', err);
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : err instanceof Error
            ? err.message
            : undefined;
        message.error(translateBackendError(msg) || 'Có lỗi xảy ra');
        throw err;
      } finally {
        setLoadingAction(null);
      }
    },
    [applyOrderStatusMutation, scheduleSyncRefetch],
  );

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
