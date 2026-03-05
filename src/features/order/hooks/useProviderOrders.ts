/**
 * Hook for fetching provider orders with filtering
 */
import { useState, useEffect, useMemo } from 'react';
import { fetchProviderOrders, prepareProviderOrder } from '../services/order.service';
import { getAuth } from '@/features/auth/services/tokenStorage';
import type { OrderItem, OrderStatus } from '../types';

type TabKey = 'PAID' | 'PREPARING';

export function useProviderOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('PAID');
  const [preparingOrderId, setPreparingOrderId] = useState<number | null>(null);

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
      setOrders(result);
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

  // Filter orders by active tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'PAID') {
      return orders.filter((order) => order.status === 'PAID');
    }
    if (activeTab === 'PREPARING') {
      return orders.filter((order) => order.status === 'PREPARING');
    }
    return orders;
  }, [orders, activeTab]);

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

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    refetch,
    prepareOrder,
    preparingOrderId,
    providerId,
  };
}
