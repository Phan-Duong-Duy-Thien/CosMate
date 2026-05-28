/**
 * Service Orders Hook
 * Fetches and filters service booking orders for the current user.
 * Counts + tab filter are client-side from one full list (same pattern as usePurchaseOrders).
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import {
  fetchAllServiceOrders,
  confirmServiceOrder,
  payServiceOrderFn,
} from '@/features/service/services/booking.service';
import { ORDER_LIST_PAGINATION_THRESHOLD } from '../constants/orderListPagination';
import type { ServiceOrder, PaymentMethod, ServicePayResult } from '@/features/service/api/booking.api';
import { getReturnUrl } from '@/features/order/utils/paymentReturnUrls';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { useRefetchOnWindowFocus } from '@/shared/hooks/useRefetchOnWindowFocus';
import { usePendingListMutation } from '@/shared/hooks/usePendingListMutation';
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge';
import { DATA_SYNC_EVENTS, notifyServiceOrdersChanged, notifyWalletChanged } from '@/shared/sync/dataSync';

export type ServicePayOutcome =
  | { kind: 'redirect'; paymentUrl: string }
  | { kind: 'completed'; status: string };

function toPayOutcome(payResult: ServicePayResult, paymentMethod: PaymentMethod): ServicePayOutcome {
  if (payResult.paymentUrl) {
    return { kind: 'redirect', paymentUrl: payResult.paymentUrl };
  }
  const status =
    payResult.status ??
    (paymentMethod === 'WALLET' ? 'PAID' : 'UNPAID');
  return { kind: 'completed', status };
}

export type ServiceOrderTab =
  | 'all'
  | 'UNCONFIRM'
  | 'UNPAID'
  | 'PAID'
  | 'WAITING_SERVICE_DATE'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'DISPUTE'
  | 'CANCELLED';

export interface ServiceOrderCounts {
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

type FetchOptions = { silent?: boolean };

export interface UseServiceOrdersResult {
  /** Full list (all statuses) — same role as allOrders in usePurchaseOrders */
  serviceOrders: ServiceOrder[];
  filteredOrders: ServiceOrder[];
  counts: ServiceOrderCounts;
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refetch: (options?: FetchOptions) => Promise<void>;
  selectedStatus: ServiceOrderTab;
  setStatus: (status: ServiceOrderTab) => void;
  confirmingOrderId: number | null;
  payingOrderId: number | null;
  confirmAndPay: (orderId: number, paymentMethod: PaymentMethod) => Promise<ServicePayOutcome>;
  payOnly: (orderId: number, paymentMethod: PaymentMethod) => Promise<ServicePayOutcome>;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
}

export function useServiceOrders(): UseServiceOrdersResult {
  const [allServiceOrders, setAllServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ServiceOrderTab>('all');
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const userId = getUserId();

  const { mergeFetched, setPendingField } = usePendingListMutation<ServiceOrder, string>({
    getItemId: (o) => o.id,
    getFieldValue: (o) => o.status,
    setFieldValue: (o, status) => ({ ...o, status }),
  });

  const applyOrdersFromFetch = useCallback(
    (orders: ServiceOrder[]) => {
      const serviceOnly = orders.filter((o) => o.orderType === 'RENT_SERVICE');
      const unexpected = orders.filter((o) => o.orderType !== 'RENT_SERVICE');
      if (unexpected.length > 0) {
        console.warn(
          '[useServiceOrders] BE returned',
          unexpected.length,
          'non-service orders — filtered out:',
          unexpected.map((o) => ({ id: o.id, type: o.orderType })),
        );
      }
      setAllServiceOrders(mergeFetched(serviceOnly));
      return serviceOnly;
    },
    [mergeFetched],
  );

  const loadAllOrders = useCallback(
    async (options?: FetchOptions) => {
      if (!userId) {
        setError('User not found');
        if (!options?.silent) setLoading(false);
        return;
      }

      const silent = options?.silent ?? false;
      if (!silent) {
        setLoading(true);
      }

      try {
        setError(null);
        const orders = await fetchAllServiceOrders(userId);
        applyOrdersFromFetch(orders);
      } catch (err) {
        console.error('[useServiceOrders] Failed to fetch service orders:', err);
        setError('Failed to load service orders');
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [userId, applyOrdersFromFetch],
  );

  useEffect(() => {
    void loadAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once per userId
  }, [userId]);

  const counts = useMemo<ServiceOrderCounts>(() => {
    const countByStatus = (status: Exclude<ServiceOrderTab, 'all'>) =>
      allServiceOrders.filter((o) => o.status === status).length;

    return {
      all: allServiceOrders.length,
      UNCONFIRM: countByStatus('UNCONFIRM'),
      UNPAID: countByStatus('UNPAID'),
      PAID: countByStatus('PAID'),
      WAITING_SERVICE_DATE: countByStatus('WAITING_SERVICE_DATE'),
      IN_SERVICE: countByStatus('IN_SERVICE'),
      COMPLETED: countByStatus('COMPLETED'),
      DISPUTE: countByStatus('DISPUTE'),
      CANCELLED: countByStatus('CANCELLED'),
    };
  }, [allServiceOrders]);

  const tabFilteredOrders = useMemo(() => {
    if (selectedStatus === 'all') {
      return allServiceOrders;
    }
    return allServiceOrders.filter((order) => order.status === selectedStatus);
  }, [allServiceOrders, selectedStatus]);

  const listTotal = tabFilteredOrders.length;

  const filteredOrders = useMemo(() => {
    if (listTotal <= ORDER_LIST_PAGINATION_THRESHOLD) {
      return tabFilteredOrders;
    }
    const start = (page - 1) * PAGE_SIZE;
    return tabFilteredOrders.slice(start, start + PAGE_SIZE);
  }, [tabFilteredOrders, listTotal, page]);

  const refetch = useCallback(
    async (options?: FetchOptions) => {
      const silent = options?.silent ?? false;
      if (silent) setIsRefreshing(true);
      try {
        await loadAllOrders({ silent: true });
      } finally {
        if (silent) setIsRefreshing(false);
      }
    },
    [loadAllOrders],
  );

  useDataSyncRefetch(
    () => refetch({ silent: true }),
    DATA_SYNC_EVENTS.SERVICE_ORDERS_CHANGED,
    Boolean(userId),
  );

  useRefetchOnWindowFocus(
    () => refetch({ silent: true }),
    Boolean(userId),
  );

  const scheduleSyncRefetch = useCallback(() => {
    scheduleBackgroundRefetch(() => {
      void refetch({ silent: true });
    });
  }, [refetch]);

  const handleSetStatus = useCallback((status: ServiceOrderTab) => {
    setPage(1);
    setSelectedStatus(status);
  }, []);

  const patchOrderStatus = useCallback(
    (orderId: number, nextStatus: string) => {
      setPendingField(orderId, nextStatus);
      setAllServiceOrders((prev) => {
        const order = prev.find((o) => o.id === orderId);
        if (!order || order.status === nextStatus) return prev;
        return prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
      });
      notifyServiceOrdersChanged({ orderId });
    },
    [setPendingField],
  );

  const applyPayOutcome = useCallback(
    (orderId: number, outcome: ServicePayOutcome, paymentMethod: PaymentMethod) => {
      if (outcome.kind === 'completed') {
        patchOrderStatus(orderId, outcome.status);
        if (paymentMethod === 'WALLET') {
          notifyWalletChanged();
        }
      }
    },
    [patchOrderStatus],
  );

  const confirmAndPay = useCallback(
    async (orderId: number, paymentMethod: PaymentMethod): Promise<ServicePayOutcome> => {
      const returnUrl = getReturnUrl(paymentMethod);
      setConfirmingOrderId(orderId);
      try {
        await confirmServiceOrder(orderId);
        patchOrderStatus(orderId, 'UNPAID');

        setConfirmingOrderId(null);
        setPayingOrderId(orderId);
        const payResult = await payServiceOrderFn(orderId, paymentMethod, returnUrl);
        const outcome = toPayOutcome(payResult, paymentMethod);
        applyPayOutcome(orderId, outcome, paymentMethod);
        scheduleSyncRefetch();
        return outcome;
      } catch (err: unknown) {
        console.error('[useServiceOrders] confirmAndPay failed:', err);
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : 'Xác nhận và thanh toán thất bại';
        throw new Error(message || 'Xác nhận và thanh toán thất bại');
      } finally {
        setConfirmingOrderId(null);
        setPayingOrderId(null);
      }
    },
    [patchOrderStatus, applyPayOutcome, scheduleSyncRefetch],
  );

  const payOnly = useCallback(
    async (orderId: number, paymentMethod: PaymentMethod): Promise<ServicePayOutcome> => {
      const returnUrl = getReturnUrl(paymentMethod);
      setPayingOrderId(orderId);
      try {
        const payResult = await payServiceOrderFn(orderId, paymentMethod, returnUrl);
        const outcome = toPayOutcome(payResult, paymentMethod);
        applyPayOutcome(orderId, outcome, paymentMethod);
        scheduleSyncRefetch();
        return outcome;
      } catch (err: unknown) {
        console.error('[useServiceOrders] payOnly failed:', err);
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : 'Thanh toán thất bại';
        throw new Error(message || 'Thanh toán thất bại');
      } finally {
        setPayingOrderId(null);
      }
    },
    [applyPayOutcome, scheduleSyncRefetch],
  );

  return {
    serviceOrders: allServiceOrders,
    filteredOrders,
    counts,
    loading,
    isRefreshing,
    error,
    refetch,
    selectedStatus,
    setStatus: handleSetStatus,
    confirmingOrderId,
    confirmAndPay,
    payingOrderId,
    payOnly,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    total: listTotal,
  };
}
