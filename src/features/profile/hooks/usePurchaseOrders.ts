/**
 * Purchase Orders Hook
 * Fetches and filters orders for the current user
 */
import { useState, useEffect, useMemo } from 'react';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { getOrdersByUserId } from '@/features/order/api/order.api';
import type { OrderItem, OrderStatus } from '@/features/order/types';

// Map UI tab to backend status
const TAB_STATUS_MAP: Record<string, OrderStatus[]> = {
  wait_confirm: ['PAID'],
  wait_shipping: ['PREPARING'],
  in_use: ['SHIPPING_OUT', 'DELIVERING_OUT', 'IN_USE'],
  completed: ['RETURNED', 'COMPLETED'],
  cancelled: ['CANCELLED'],
};

export type OrderTab = 'all' | keyof typeof TAB_STATUS_MAP;

export interface OrderCounts {
  all: number;
  wait_confirm: number;
  wait_shipping: number;
  in_use: number;
  completed: number;
  cancelled: number;
}

export interface UsePurchaseOrdersResult {
  orders: OrderItem[];
  filteredOrders: OrderItem[];
  counts: OrderCounts;
  loading: boolean;
  error: string | null;
}

export function usePurchaseOrders(tab: OrderTab = 'all'): UsePurchaseOrdersResult {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setOrders(data);
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
      in_use: countByStatuses(TAB_STATUS_MAP.in_use),
      completed: countByStatuses(TAB_STATUS_MAP.completed),
      cancelled: countByStatuses(TAB_STATUS_MAP.cancelled),
    };
  }, [orders]);

  return {
    orders,
    filteredOrders,
    counts,
    loading,
    error,
  };
}
