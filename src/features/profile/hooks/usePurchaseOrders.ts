/**
 * Purchase Orders Hook
 * Fetches and filters orders for the current user
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getOrdersByUserId, getAllOrdersByUserId } from '@/features/order/api/order.api';
import { confirmDeliveryOrder, returnCosplayerOrder } from '@/features/order/services/order.service';
import { getCostumeById } from '@/features/costume-rental/api/costume.api';
import { resolveImageUrl } from '@/features/costume-rental/hooks/usePublicCostumeDetail';
import type { OrderItem, OrderStatus } from '@/features/order/types';

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

export interface UsePurchaseOrdersResult {
  filteredOrders: OrderItem[];
  counts: OrderCounts;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  confirmDelivery: (orderId: number, images: File[], notes: string[]) => Promise<boolean>;
  confirmingDeliveryId: number | null;
  returnOrder: (orderId: number, trackingCode: string, images: File[], notes: string[]) => Promise<boolean>;
  returningOrderId: number | null;
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
  const [error, setError] = useState<string | null>(null);
  const [confirmingDeliveryId, setConfirmingDeliveryId] = useState<number | null>(null);
  const [returningOrderId, setReturningOrderId] = useState<number | null>(null);
  const [costumeImageMap, setCostumeImageMap] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isPaginated, setIsPaginated] = useState(false);
  const PAGE_SIZE = 10;

  const userId = getUserId();

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
          // BE supports true server-side pagination
          fetchedOrders = result.orders.filter((o) => o.orderType === 'RENT_COSTUME');
          fetchedTotal = result.total;
        } else {
          // BE returns flat array → fetch all, apply client-side filter + slice
          fetchedOrders = await getAllOrdersByUserId(userId);
          fetchedOrders = fetchedOrders.filter((o) => o.orderType === 'RENT_COSTUME');
          fetchedTotal = fetchedOrders.length;
        }

        setAllOrders(fetchedOrders);
        setTotal(fetchedTotal);
        setIsPaginated(fetchedPaginated);

        // Batch-fetch costume images
        const uniqueIds = [...new Set(fetchedOrders.map((o) => o.costumeId).filter(Boolean))];
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
          })
        );
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Filter + paginate from full list
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    if (tab !== 'all') {
      const allowed = TAB_STATUS_MAP[tab];
      if (allowed) {
        filtered = filtered.filter((o) => allowed.includes(o.status));
      }
    }

    // Apply client-side slice only when BE doesn't support server pagination
    if (!isPaginated) {
      const start = (page - 1) * PAGE_SIZE;
      filtered = filtered.slice(start, start + PAGE_SIZE);
    }

    return filtered;
  }, [allOrders, tab, page, isPaginated]);

  // Counts computed from full list (not filtered/paginated slice)
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

  // Refetch
  const refetch = useCallback(async () => {
    setPage(1);
    if (!userId) return;
    try {
      let fetchedOrders = await getAllOrdersByUserId(userId);
      fetchedOrders = fetchedOrders.filter((o) => o.orderType === 'RENT_COSTUME');
      setAllOrders(fetchedOrders);
      setTotal(fetchedOrders.length);
      const uniqueIds = [...new Set(fetchedOrders.map((o) => o.costumeId).filter(Boolean))];
      await Promise.all(
        uniqueIds.map(async (cid) => {
          try {
            const costume = await getCostumeById(cid);
            const url = resolveImageUrl(costume.imageUrls?.[0] ?? '');
            if (url) {
              setCostumeImageMap((prev) => ({ ...prev, [cid]: url }));
            }
          } catch {
            // silently ignore
          }
        })
      );
    } catch (err) {
      console.error('Failed to refetch orders:', err);
    }
  }, [userId]);

  const confirmDelivery = useCallback(
    async (orderId: number, images: File[], notes: string[]) => {
      setConfirmingDeliveryId(orderId);
      try {
        await confirmDeliveryOrder(orderId, images, notes);
        await refetch();
        return true;
      } catch {
        return false;
      } finally {
        setConfirmingDeliveryId(null);
      }
    },
    [refetch]
  );

  const returnOrder = useCallback(
    async (orderId: number, trackingCode: string, images: File[], notes: string[]) => {
      setReturningOrderId(orderId);
      try {
        await returnCosplayerOrder(orderId, trackingCode, notes, images);
        await refetch();
        return true;
      } catch {
        return false;
      } finally {
        setReturningOrderId(null);
      }
    },
    [refetch]
  );

  return {
    filteredOrders,
    counts,
    loading,
    error,
    refetch,
    confirmDelivery,
    confirmingDeliveryId,
    returnOrder,
    returningOrderId,
    costumeImageMap,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    total,
    isPaginated,
  };
}
