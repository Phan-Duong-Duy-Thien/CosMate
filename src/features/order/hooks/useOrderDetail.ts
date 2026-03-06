/**
 * useOrderDetail Hook
 * Fetches order detail by ID
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchOrderDetail } from '../services/order.service';
import type { OrderDetail } from '../types';

interface UseOrderDetailResult {
  orderDetail: OrderDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrderDetail(orderId: number | null): UseOrderDetailResult {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!orderId) {
      setOrderDetail(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrderDetail(orderId);
      setOrderDetail(data);
    } catch (err) {
      console.error('Failed to fetch order detail:', err);
      setError('Failed to load order detail');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    orderDetail,
    loading,
    error,
    refetch: fetchDetail,
  };
}
