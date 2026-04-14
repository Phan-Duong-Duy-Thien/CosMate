/**
 * useCreateDispute Hook
 * Creates a dispute for an order
 */
import { useState, useCallback } from 'react';
import { createDisputeService } from '../services/order.service';

interface UseCreateDisputeResult {
  createDispute: (orderId: number) => Promise<boolean>;
  disputingOrderId: number | null;
}

export function useCreateDispute(): UseCreateDisputeResult {
  const [disputingOrderId, setDisputingOrderId] = useState<number | null>(null);

  const createDispute = useCallback(async (orderId: number) => {
    setDisputingOrderId(orderId);
    try {
      await createDisputeService(orderId);
      return true;
    } catch {
      return false;
    } finally {
      setDisputingOrderId(null);
    }
  }, []);

  return { createDispute, disputingOrderId };
}
