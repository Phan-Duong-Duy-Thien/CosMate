/**
 * Hook for fetching provider orders with filtering
 */
import { useState, useEffect, useMemo } from 'react';
import { fetchProviderOrders, prepareProviderOrder, deliverOutProviderOrder, shipProviderOrder, completeProviderOrder } from '../services/order.service';
import { getAuth } from '@/features/auth/services/tokenStorage';
import { getUserById } from '@/features/admin/api/adminUsers.api';
import type { OrderItem, OrderStatus } from '../types';

// Fixed status tabs configuration
export const ORDER_STATUS_TABS: Array<{ key: OrderStatus | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'all' },
  { key: 'UNPAID', label: 'unpaid' },
  { key: 'PAID', label: 'paid' },
  { key: 'PREPARING', label: 'preparing' },
  { key: 'SHIPPING_OUT', label: 'shippingOut' },
  { key: 'DELIVERING_OUT', label: 'deliveringOut' },
  { key: 'IN_USE', label: 'inUse' },
  { key: 'SHIPPING_BACK', label: 'shippingBack' },
  { key: 'COMPLETED', label: 'completed' },
  { key: 'CANCELLED', label: 'cancelled' },
  { key: 'DISPUTE', label: 'dispute' },
  { key: 'EXTENDING', label: 'extending' },
];

type TabKey = OrderStatus | 'ALL';

export function useProviderOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [preparingOrderId, setPreparingOrderId] = useState<number | null>(null);
  const [deliveringOutOrderId, setDeliveringOutOrderId] = useState<number | null>(null);
  const [shippingOrderId, setShippingOrderId] = useState<number | null>(null);
  const [completingOrderId, setCompletingOrderId] = useState<number | null>(null);

  // Get providerId from JWT token
  const providerId = useMemo(() => {
    const auth = getAuth();
    if (!auth?.token) return null;
    
    try {
      const parts = auth.token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const decoded = JSON.parse(jsonPayload);
      return decoded?.providerId ?? decoded?.provider_id ?? null;
    } catch {
      return null;
    }
  }, []);

  // Fetch orders on mount
  const refetch = async () => {
    if (!providerId) {
      setError('Không tìm thấy thông tin provider. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchProviderOrders(providerId);
      // Defensive: only keep RENT_COSTUME orders. Service orders (RENT_SERVICE) should never
      // appear here — they have their own API and page. Filter to prevent cross-type
      // contamination if BE ever returns both types from this endpoint.
      const costumeOrders = result.filter((o) => o.orderType === 'RENT_COSTUME');

      // Batch resolve missing cosplayerName from cosplayerId
      const ordersNeedingName = costumeOrders.filter((o) => !o.cosplayerName);
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
        costumeOrders.forEach((order) => {
          if (!order.cosplayerName) {
            order.cosplayerName = cosplayerMap[order.cosplayerId] ?? order.cosplayerName;
          }
        });
      }
      const unexpected = result.filter((o) => o.orderType !== 'RENT_COSTUME');
      if (unexpected.length > 0) {
        console.warn(
          '[useProviderOrders] BE returned',
          unexpected.length,
          'non-RENT_COSTUME orders — filtered out:',
          unexpected.map((o) => ({ id: o.id, type: o.orderType }))
        );
      }
      setOrders(costumeOrders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [providerId]);

  // Filter orders by active tab and search term
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by tab
    if (activeTab !== 'ALL') {
      result = result.filter((order) => order.status === activeTab);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (order) =>
          order.id.toString().includes(term) ||
          order.cosplayerId.toString().includes(term) ||
          (order.cosplayerName && order.cosplayerName.toLowerCase().includes(term))
      );
    }

    return result;
  }, [orders, activeTab, searchTerm]);

  // Get count for each status tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };
    // Single pass through orders - O(n) instead of O(n*m)
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Prepare order action
  const prepareOrder = async (orderId: number) => {
    setPreparingOrderId(orderId);
    try {
      await prepareProviderOrder(orderId);
      await refetch();
      return true;
    } catch {
      return false;
    } finally {
      setPreparingOrderId(null);
    }
  };

  // Deliver out order action
  const deliverOutOrder = async (orderId: number) => {
    setDeliveringOutOrderId(orderId);
    try {
      await deliverOutProviderOrder(orderId);
      await refetch();
      return true;
    } catch {
      return false;
    } finally {
      setDeliveringOutOrderId(null);
    }
  };

  // Ship order action
  const shipOrder = async (
    orderId: number,
    trackingCode: string,
    shippingCarrierName: string,
    notes: string[],
    images: File[]
  ) => {
    setShippingOrderId(orderId);
    try {
      await shipProviderOrder(orderId, trackingCode, shippingCarrierName, notes, images);
      await refetch();
      return true;
    } catch {
      return false;
    } finally {
      setShippingOrderId(null);
    }
  };

  // Complete order action
  const completeOrder = async (orderId: number) => {
    setCompletingOrderId(orderId);
    try {
      await completeProviderOrder(orderId);
      await refetch();
      return true;
    } catch {
      return false;
    } finally {
      setCompletingOrderId(null);
    }
  };

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    tabCounts,
    refetch,
    prepareOrder,
    preparingOrderId,
    deliverOutOrder,
    deliveringOutOrderId,
    shipOrder,
    shippingOrderId,
    completeOrder,
    completingOrderId,
    providerId,
  };
}
