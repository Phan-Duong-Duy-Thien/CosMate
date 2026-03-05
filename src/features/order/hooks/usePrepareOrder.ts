/**
 * Hook for preparing an order (updating status to PREPARING)
 */
import { useState } from 'react';
import { prepareOrder as prepareOrderService } from '../services/order.service';

export function usePrepareOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prepare = async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      await prepareOrderService(orderId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to prepare order';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { prepare, loading, error };
}
