/**
 * useCancelOrder Hook
 * Cancels an order (status → CANCELLED)
 *
 * NOTE: The cancel API does NOT return updated order.
 * After success, caller MUST call refetch to update UI.
 */
import { useState, useCallback } from 'react';
import { cancelOrder as cancelOrderApi } from '../services/order.service';

interface UseCancelOrderResult {
  cancelOrder: (orderId: number) => Promise<boolean>;
  cancellingOrderId: number | null;
}

export function useCancelOrder(): UseCancelOrderResult {
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  const cancelOrder = useCallback(async (orderId: number) => {
    setCancellingOrderId(orderId);
    try {
      await cancelOrderApi(orderId);
      return true;
    } catch {
      return false;
    } finally {
      setCancellingOrderId(null);
    }
  }, []);

  return { cancelOrder, cancellingOrderId };
}