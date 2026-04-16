/**
 * Purchase Orders Hook
 * Fetches and filters orders for the current user
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getOrdersByUserId } from '@/features/order/api/order.api';
import { confirmDeliveryOrder, returnCosplayerOrder } from '@/features/order/services/order.service';
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
  shipping_combined: number; // Combined count for profile summary
}

export interface UsePurchaseOrdersResult {
  orders: OrderItem[];
  filteredOrders: OrderItem[];
  counts: OrderCounts;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  confirmDelivery: (orderId: number, images: File[], notes: string[]) => Promise<boolean>;
  confirmingDeliveryId: number | null;
  returnOrder: (orderId: number, trackingCode: string, images: File[], notes: string[]) => Promise<boolean>;
  returningOrderId: number | null;
}

export function usePurchaseOrders(tab: OrderTab = 'all'): UsePurchaseOrdersResult {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDeliveryId, setConfirmingDeliveryId] = useState<number | null>(null);
  const [returningOrderId, setReturningOrderId] = useState<number | null>(null);

  const userId = getUserId();

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
        const data = await getOrdersByUserId(userId);
        // FIX: Only keep RENT_COSTUME orders. The BE /api/orders/user/{userId} may return
        // both RENT_COSTUME and RENT_SERVICE orders. Filter here to prevent
        // service orders from leaking into the costume tab.
        const costumeOrders = data.filter((o) => o.orderType === 'RENT_COSTUME');
        costumeOrders.forEach((order) => {
          console.log('[ORDER DEBUG]', {
            id: order.id,
            type: order.orderType,
            status: order.status,
          });
        });
        // Warn if BE returned unexpected order types
        const unexpected = data.filter((o) => o.orderType !== 'RENT_COSTUME');
        if (unexpected.length > 0) {
          console.warn(
            '[usePurchaseOrders] BE returned',
            unexpected.length,
            'non-RENT_COSTUME orders — filtered out:',
            unexpected.map((o) => ({ id: o.id, type: o.orderType, status: o.status }))
          );
        }
        setOrders(costumeOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Filter orders based on tab
  const filteredOrders = useMemo(() => {
    if (tab === 'all') {
      return orders;
    }

    const allowedStatuses = TAB_STATUS_MAP[tab];
    if (!allowedStatuses) {
      return orders;
    }

    return orders.filter((order) => allowedStatuses.includes(order.status));
  }, [orders, tab]);

  // Calculate counts for each tab
  const counts = useMemo(() => {
    const countByStatuses = (statuses: OrderStatus[]) =>
      orders.filter((order) => statuses.includes(order.status)).length;

    return {
      all: orders.length,
      wait_confirm: countByStatuses(TAB_STATUS_MAP.wait_confirm),
      wait_shipping: countByStatuses(TAB_STATUS_MAP.wait_shipping),
      shipping_out: countByStatuses(TAB_STATUS_MAP.shipping_out),
      delivering_out: countByStatuses(TAB_STATUS_MAP.delivering_out),
      in_use: countByStatuses(TAB_STATUS_MAP.in_use),
      shipping_back: countByStatuses(TAB_STATUS_MAP.shipping_back),
      completed: countByStatuses(TAB_STATUS_MAP.completed),
      cancelled: countByStatuses(TAB_STATUS_MAP.cancelled),
      // Combined shipping count for profile summary (SHIPPING_OUT + DELIVERING_OUT)
      shipping_combined: countByStatuses(SHIPPING_STATUSES),
    };
  }, [orders]);

  // Refetch orders
  const refetch = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getOrdersByUserId(userId);
      const costumeOrders = data.filter((o) => o.orderType === 'RENT_COSTUME');
      setOrders(costumeOrders);
    } catch (err) {
      console.error('Failed to refetch orders:', err);
    }
  }, [userId]);

  // Confirm delivery action
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

  // Return order action
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
    orders,
    filteredOrders,
    counts,
    loading,
    error,
    refetch,
    confirmDelivery,
    confirmingDeliveryId,
    returnOrder,
    returningOrderId,
  };
}
