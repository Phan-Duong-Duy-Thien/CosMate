/**
 * Purchase Orders Hook
 * Fetches and filters orders for the current user
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getOrdersByUserId, getAllOrdersByUserId } from '@/features/order/api/order.api';
import {
  confirmDeliveryOrder,
  returnCosplayerOrder,
  cancelOrder as cancelOrderApi,
} from '@/features/order/services/order.service';
import { getCostumeById } from '@/features/costume-rental/api/costume.api';
import { resolveImageUrl } from '@/features/costume-rental/hooks/usePublicCostumeDetail';
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch';
import { useRefetchOnWindowFocus } from '@/shared/hooks/useRefetchOnWindowFocus';
import { usePendingListMutation } from '@/shared/hooks/usePendingListMutation';
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge';
import { DATA_SYNC_EVENTS, notifyOrdersChanged } from '@/shared/sync/dataSync';
import { mergeOrderFromMutation, patchOrderStatus } from '@/shared/sync/patchOrderList';
import type { OrderItem, OrderStatus } from '@/features/order/types';
import { ORDER_LIST_PAGINATION_THRESHOLD } from '../constants/orderListPagination';

// Map UI tab to backend status
const TAB_STATUS_MAP: Record<string, OrderStatus[]> = {
  wait_confirm: ['PAID'],
  wait_shipping: ['PREPARING'],
  shipping_out: ['SHIPPING_OUT'],
  delivering_out: ['DELIVERING_OUT'],
  in_use: ['IN_USE'],
  shipping_back: ['SHIPPING_BACK'],
  completed: ['RETURNED', 'COMPLETED'],
  cancelled: ['CANCELLED'],
};

// Combined shipping status for profile summary (SHIPPING_OUT + DELIVERING_OUT)
export const SHIPPING_STATUSES: OrderStatus[] = ['SHIPPING_OUT', 'DELIVERING_OUT'];

export type OrderTab = 'all' | keyof typeof TAB_STATUS_MAP;

export interface OrderCounts {
  all: number;
  wait_confirm: number;
  wait_shipping: number;
  shipping_out: number;
  delivering_out: number;
  in_use: number;
  shipping_back: number;
  completed: number;
  cancelled: number;
  shipping_combined: number;
}

type FetchOptions = { silent?: boolean };

export interface UsePurchaseOrdersResult {
  filteredOrders: OrderItem[];
  counts: OrderCounts;
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refetch: (options?: FetchOptions) => Promise<void>;
  confirmDelivery: (orderId: number, images: File[], notes: string[]) => Promise<boolean>;
  confirmingDeliveryId: number | null;
  returnOrder: (
    orderId: number,
    trackingCode: string,
    shippingCarrierName: string,
    images: File[],
    notes: string[],
    autoCreateGhn?: boolean
  ) => Promise<boolean>;
  returningOrderId: number | null;
  cancelOrder: (orderId: number) => Promise<boolean>;
  cancellingOrderId: number | null;
  costumeImageMap: Record<number, string>;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
  isPaginated: boolean;
}

export function usePurchaseOrders(tab: OrderTab = 'all'): UsePurchaseOrdersResult {
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDeliveryId, setConfirmingDeliveryId] = useState<number | null>(null);
  const [returningOrderId, setReturningOrderId] = useState<number | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [costumeImageMap, setCostumeImageMap] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isPaginated, setIsPaginated] = useState(false);
  const PAGE_SIZE = 10;

  const userId = getUserId();

  const { mergeFetched, setPendingField } = usePendingListMutation<OrderItem, OrderStatus>({
    getItemId: (o) => o.id,
    getFieldValue: (o) => o.status,
    setFieldValue: (o, status) => ({ ...o, status }),
  });

  const loadCostumeImages = useCallback(async (orders: OrderItem[]) => {
    const uniqueIds = [...new Set(orders.map((o) => o.costumeId).filter(Boolean))];
    await Promise.all(
      uniqueIds.map(async (cid) => {
        try {
          const costume = await getCostumeById(cid);
          const url = resolveImageUrl(costume.imageUrls?.[0] ?? '');
          if (url) {
            setCostumeImageMap((prev) => ({ ...prev, [cid]: url }));
          }
        } catch {
          // Silently ignore
        }
      }),
    );
  }, []);

  const applyOrdersFromFetch = useCallback(
    (fetchedOrders: OrderItem[]) => {
      const costumeOnly = fetchedOrders.filter((o) => o.orderType === 'RENT_COSTUME');
      setAllOrders(mergeFetched(costumeOnly));
      setTotal(costumeOnly.length);
      return costumeOnly;
    },
    [mergeFetched],
  );

  // Fetch all orders once (or per page if BE supports server-side pagination)
  useEffect(() => {
    if (!userId) {
      setError('User not found');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedOrders: OrderItem[];
        let fetchedTotal: number;
        let fetchedPaginated: boolean;

        const result = await getOrdersByUserId(userId, page, PAGE_SIZE);
        fetchedPaginated = result.isPaginated;

        if (result.isPaginated) {
          fetchedOrders = result.orders.filter((o) => o.orderType === 'RENT_COSTUME');
          fetchedTotal = result.total;
        } else {
          fetchedOrders = await getAllOrdersByUserId(userId);
          fetchedOrders = fetchedOrders.filter((o) => o.orderType === 'RENT_COSTUME');
          fetchedTotal = fetchedOrders.length;
        }

        applyOrdersFromFetch(fetchedOrders);
        setIsPaginated(fetchedPaginated);
        if (!fetchedPaginated) {
          setTotal(fetchedTotal);
        }

        await loadCostumeImages(fetchedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
    // mergeFetched is stable (usePendingListMutation uses refs for getters)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: fetch once per userId
  }, [userId]);

  const tabFilteredOrders = useMemo(() => {
    if (tab === 'all') return allOrders;
    const allowed = TAB_STATUS_MAP[tab];
    if (!allowed) return allOrders;
    return allOrders.filter((o) => allowed.includes(o.status));
  }, [allOrders, tab]);

  const listTotal = tabFilteredOrders.length;

  const filteredOrders = useMemo(() => {
    if (isPaginated) return tabFilteredOrders;

    if (listTotal <= ORDER_LIST_PAGINATION_THRESHOLD) {
      return tabFilteredOrders;
    }

    const start = (page - 1) * PAGE_SIZE;
    return tabFilteredOrders.slice(start, start + PAGE_SIZE);
  }, [tabFilteredOrders, listTotal, page, isPaginated]);

  const counts = useMemo(() => {
    const countByStatuses = (statuses: OrderStatus[]) =>
      allOrders.filter((order) => statuses.includes(order.status)).length;

    return {
      all: allOrders.length,
      wait_confirm: countByStatuses(TAB_STATUS_MAP.wait_confirm),
      wait_shipping: countByStatuses(TAB_STATUS_MAP.wait_shipping),
      shipping_out: countByStatuses(TAB_STATUS_MAP.shipping_out),
      delivering_out: countByStatuses(TAB_STATUS_MAP.delivering_out),
      in_use: countByStatuses(TAB_STATUS_MAP.in_use),
      shipping_back: countByStatuses(TAB_STATUS_MAP.shipping_back),
      completed: countByStatuses(TAB_STATUS_MAP.completed),
      cancelled: countByStatuses(TAB_STATUS_MAP.cancelled),
      shipping_combined: countByStatuses(SHIPPING_STATUSES),
    };
  }, [allOrders]);

  const refetch = useCallback(async (options?: FetchOptions) => {
    const silent = options?.silent ?? false;
    if (!userId) return;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setPage(1);
      setLoading(true);
    }

    try {
      let fetchedOrders = await getAllOrdersByUserId(userId);
      const costumeOrders = applyOrdersFromFetch(fetchedOrders);
      await loadCostumeImages(costumeOrders);
    } catch (err) {
      console.error('Failed to refetch orders:', err);
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [userId, applyOrdersFromFetch, loadCostumeImages]);

  const scheduleSyncRefetch = useCallback(() => {
    scheduleBackgroundRefetch(() => refetch({ silent: true }));
  }, [refetch]);

  useDataSyncRefetch(
    () => refetch({ silent: true }),
    DATA_SYNC_EVENTS.ORDERS_CHANGED,
    Boolean(userId),
  );

  useRefetchOnWindowFocus(
    () => refetch({ silent: true }),
    Boolean(userId),
  );

  const applyOrderMutation = useCallback(
    (orderId: number, nextStatus: OrderStatus, partial?: Partial<OrderItem>) => {
      setPendingField(orderId, nextStatus);
      setAllOrders((prev) =>
        partial
          ? mergeOrderFromMutation(prev, orderId, { ...partial, status: nextStatus })
          : patchOrderStatus(prev, orderId, nextStatus),
      );
      notifyOrdersChanged({ orderId, orderType: 'RENT_COSTUME' });
      scheduleSyncRefetch();
    },
    [setPendingField, scheduleSyncRefetch],
  );

  const confirmDelivery = useCallback(
    async (orderId: number, images: File[], notes: string[]) => {
      setConfirmingDeliveryId(orderId);
      try {
        const updated = await confirmDeliveryOrder(orderId, images, notes);
        const nextStatus = (updated?.status ?? 'IN_USE') as OrderStatus;
        applyOrderMutation(orderId, nextStatus, updated ?? undefined);
        return true;
      } catch {
        return false;
      } finally {
        setConfirmingDeliveryId(null);
      }
    },
    [applyOrderMutation],
  );

  const returnOrder = useCallback(
    async (
      orderId: number,
      trackingCode: string,
      shippingCarrierName: string,
      images: File[],
      notes: string[],
      autoCreateGhn = false,
    ) => {
      setReturningOrderId(orderId);
      try {
        const updated = await returnCosplayerOrder(
          orderId,
          trackingCode,
          shippingCarrierName,
          notes,
          images,
          { autoCreateGhn },
        );
        if (updated && typeof updated === 'object' && 'status' in updated) {
          applyOrderMutation(orderId, updated.status as OrderStatus, updated);
        } else {
          applyOrderMutation(orderId, 'SHIPPING_BACK');
        }
        return true;
      } catch {
        return false;
      } finally {
        setReturningOrderId(null);
      }
    },
    [applyOrderMutation],
  );

  const cancelOrder = useCallback(
    async (orderId: number) => {
      setCancellingOrderId(orderId);
      try {
        await cancelOrderApi(orderId);
        applyOrderMutation(orderId, 'CANCELLED');
        return true;
      } catch {
        return false;
      } finally {
        setCancellingOrderId(null);
      }
    },
    [applyOrderMutation],
  );

  return {
    filteredOrders,
    counts,
    loading,
    isRefreshing,
    error,
    refetch,
    confirmDelivery,
    confirmingDeliveryId,
    returnOrder,
    returningOrderId,
    cancelOrder,
    cancellingOrderId,
    costumeImageMap,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    total: listTotal,
    isPaginated,
  };
}
