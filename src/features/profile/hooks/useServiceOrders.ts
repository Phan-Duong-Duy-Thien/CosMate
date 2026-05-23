/**
 * Service Orders Hook
 * Fetches and filters service booking orders for the current user
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { fetchServiceOrders, confirmServiceOrder, payServiceOrderFn } from '@/features/service/services/booking.service';
import { ORDER_LIST_PAGINATION_THRESHOLD } from '../constants/orderListPagination';
import type { ServiceOrder, PaymentMethod } from '@/features/service/api/booking.api';
import { getReturnUrl } from '@/features/order/utils/paymentReturnUrls';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { DATA_SYNC_EVENTS, notifyServiceOrdersChanged } from '@/shared/sync/dataSync';

export type ServiceOrderTab = 'all' | 'UNCONFIRM' | 'UNPAID' | 'PAID' | 'WAITING_SERVICE_DATE' | 'IN_SERVICE' | 'COMPLETED' | 'DISPUTE' | 'CANCELLED';

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
  confirmAndPay: (orderId: number, paymentMethod: PaymentMethod) => Promise<string | null>;
  payOnly: (orderId: number, paymentMethod: PaymentMethod) => Promise<string | null>;
  /** Pagination */
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
}

function adjustCount(
  counts: ServiceOrderCounts,
  status: string,
  delta: number,
): ServiceOrderCounts {
  if (status === 'all' || !(status in counts)) return counts;
  const key = status as keyof ServiceOrderCounts;
  return {
    ...counts,
    [key]: Math.max(0, (counts[key] as number) + delta),
  };
}

export function useServiceOrders(): UseServiceOrdersResult {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ServiceOrderTab>('all');
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<ServiceOrderCounts>({
    all: 0,
    UNCONFIRM: 0,
    UNPAID: 0,
    PAID: 0,
    WAITING_SERVICE_DATE: 0,
    IN_SERVICE: 0,
    COMPLETED: 0,
    DISPUTE: 0,
    CANCELLED: 0,
  });
  const PAGE_SIZE = 10;

  const userId = getUserId();

  const fetchData = useCallback(async (
    status?: ServiceOrderTab,
    pageNum: number = 1,
    options?: FetchOptions,
  ) => {
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
      const apiStatuses = status && status !== 'all' ? status : undefined;
      let { orders, total: fetchedTotal } = await fetchServiceOrders(
        userId,
        apiStatuses,
        pageNum,
        PAGE_SIZE
      );

      if (
        fetchedTotal <= ORDER_LIST_PAGINATION_THRESHOLD &&
        pageNum === 1 &&
        orders.length < fetchedTotal
      ) {
        const fullPage = await fetchServiceOrders(userId, apiStatuses, 1, fetchedTotal);
        orders = fullPage.orders;
        fetchedTotal = fullPage.total;
      }
      const serviceOrdersList = orders.filter((o) => o.orderType === 'RENT_SERVICE');
      const unexpected = orders.filter((o) => o.orderType !== 'RENT_SERVICE');
      if (unexpected.length > 0) {
        console.warn(
          '[useServiceOrders] BE returned',
          unexpected.length,
          'non-service orders — filtered out:',
          unexpected.map((o) => ({ id: o.id, type: o.orderType }))
        );
      }
      setServiceOrders(serviceOrdersList);
      setTotal(fetchedTotal);
    } catch (err) {
      console.error('[useServiceOrders] Failed to fetch service orders:', err);
      setError('Failed to load service orders');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchData(selectedStatus, page);
  }, [fetchData, selectedStatus, page]);

  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') {
      return serviceOrders;
    }
    return serviceOrders.filter((order) => order.status === selectedStatus);
  }, [serviceOrders, selectedStatus]);

  const fetchCounts = useCallback(async () => {
    if (!userId) return;
    try {
      const statuses: ServiceOrderTab[] = [
        'UNCONFIRM',
        'UNPAID',
        'PAID',
        'WAITING_SERVICE_DATE',
        'IN_SERVICE',
        'COMPLETED',
        'DISPUTE',
        'CANCELLED',
      ];
      const [allRes, ...statusRes] = await Promise.all([
        fetchServiceOrders(userId, undefined, 1, 1),
        ...statuses.map((status) => fetchServiceOrders(userId, status, 1, 1)),
      ]);
      setCounts({
        all: allRes.total,
        UNCONFIRM: statusRes[0]?.total ?? 0,
        UNPAID: statusRes[1]?.total ?? 0,
        PAID: statusRes[2]?.total ?? 0,
        WAITING_SERVICE_DATE: statusRes[3]?.total ?? 0,
        IN_SERVICE: statusRes[4]?.total ?? 0,
        COMPLETED: statusRes[5]?.total ?? 0,
        DISPUTE: statusRes[6]?.total ?? 0,
        CANCELLED: statusRes[7]?.total ?? 0,
      });
    } catch (err) {
      console.warn('[useServiceOrders] Failed to fetch counts:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleSetStatus = useCallback((status: ServiceOrderTab) => {
    setPage(1);
    setSelectedStatus(status);
    fetchData(status, 1);
  }, [fetchData]);

  const refetch = useCallback(async (options?: FetchOptions) => {
    const silent = options?.silent ?? false;
    if (silent) setIsRefreshing(true);
    try {
      await fetchData(selectedStatus, page, { silent: true });
      await fetchCounts();
    } finally {
      if (silent) setIsRefreshing(false);
    }
  }, [fetchData, selectedStatus, page, fetchCounts]);

  useDataSyncRefetch(
    () => refetch({ silent: true }),
    DATA_SYNC_EVENTS.SERVICE_ORDERS_CHANGED,
    Boolean(userId),
  );

  const patchOrderStatus = useCallback((orderId: number, nextStatus: string) => {
    setServiceOrders((prev) => {
      const order = prev.find((o) => o.id === orderId);
      if (!order || order.status === nextStatus) return prev;

      const prevStatus = order.status;
      setCounts((c) => {
        let next = adjustCount(c, prevStatus, -1);
        next = adjustCount(next, nextStatus, 1);
        return next;
      });

      return prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
    });
    notifyServiceOrdersChanged({ orderId });
  }, []);

  const confirmAndPay = useCallback(async (orderId: number, paymentMethod: PaymentMethod): Promise<string | null> => {
    const returnUrl = getReturnUrl(paymentMethod);
    setConfirmingOrderId(orderId);
    try {
      await confirmServiceOrder(orderId);
      patchOrderStatus(orderId, 'UNPAID');
      void refetch({ silent: true });

      setConfirmingOrderId(null);
      setPayingOrderId(orderId);
      const paymentUrl = await payServiceOrderFn(orderId, paymentMethod, returnUrl);
      return paymentUrl;
    } catch (err: unknown) {
      console.error('[useServiceOrders] confirmAndPay failed:', err);
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Xác nhận và thanh toán thất bại';
      throw new Error(message || 'Xác nhận và thanh toán thất bại');
    } finally {
      setConfirmingOrderId(null);
      setPayingOrderId(null);
    }
  }, [patchOrderStatus, refetch]);

  const payOnly = useCallback(async (orderId: number, paymentMethod: PaymentMethod): Promise<string | null> => {
    const returnUrl = getReturnUrl(paymentMethod);
    setPayingOrderId(orderId);
    try {
      const paymentUrl = await payServiceOrderFn(orderId, paymentMethod, returnUrl);
      void refetch({ silent: true });
      return paymentUrl;
    } catch (err: unknown) {
      console.error('[useServiceOrders] payOnly failed:', err);
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Thanh toán thất bại';
      throw new Error(message || 'Thanh toán thất bại');
    } finally {
      setPayingOrderId(null);
    }
  }, [refetch]);

  return {
    serviceOrders,
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
    total,
  };
}
