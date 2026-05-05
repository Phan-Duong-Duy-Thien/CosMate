/**
 * useOrderExtends Hook
 * Fetches list of extend transactions for an order.
 */
import { useState, useEffect, useCallback } from 'react';
import { getOrderExtends, type OrderExtend } from '../api/order.api';

interface UseOrderExtendsResult {
  extends: OrderExtend[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrderExtends(orderId: number | null): UseOrderExtendsResult {
  const [extendsList, setExtendsList] = useState<OrderExtend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderExtends(orderId);
      setExtendsList(data);
    } catch {
      setError('Không thể tải lịch sử gia hạn.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { extends: extendsList, loading, error, refetch: fetch };
}
