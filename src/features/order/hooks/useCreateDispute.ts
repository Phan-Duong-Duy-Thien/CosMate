/**
 * useCreateDispute Hook
 * Creates a dispute for an order
 */
import { useState, useCallback } from 'react';
import { createDisputeService } from '../services/order.service';

interface CreateDisputePayload {
  reason: string;
  files: string[];
}

interface UseCreateDisputeResult {
  createDispute: (orderId: number, payload: CreateDisputePayload) => Promise<boolean>;
  disputingOrderId: number | null;
}

export function useCreateDispute(): UseCreateDisputeResult {
  const [disputingOrderId, setDisputingOrderId] = useState<number | null>(null);

  const createDispute = useCallback(
    async (orderId: number, payload: CreateDisputePayload) => {
      setDisputingOrderId(orderId);
      try {
        await createDisputeService(orderId, payload);
        return true;
      } catch {
        return false;
      } finally {
        setDisputingOrderId(null);
      }
    },
    []
  );

  return { createDispute, disputingOrderId };
}
