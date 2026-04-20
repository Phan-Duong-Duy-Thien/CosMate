/**
 * useExtendDetail Hook
 * Fetches full detail of a single extend transaction.
 */
import { useState, useCallback } from 'react';
import { getExtendDetail, type OrderExtendDetail } from '../api/order.api';

interface UseExtendDetailResult {
  detail: OrderExtendDetail | null;
  loading: boolean;
  error: string | null;
  fetchDetail: (orderId: number, detailId: number, extendId: number) => Promise<void>;
  reset: () => void;
}

export function useExtendDetail(): UseExtendDetailResult {
  const [detail, setDetail] = useState<OrderExtendDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (orderId: number, detailId: number, extendId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExtendDetail(orderId, detailId, extendId);
      setDetail(data);
    } catch {
      setError('Không thể tải chi tiết gia hạn.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return { detail, loading, error, fetchDetail, reset };
}
