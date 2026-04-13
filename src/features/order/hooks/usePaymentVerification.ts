/**
 * usePaymentVerification
 *
 * When PaymentResultPage lands with an orderId, this hook fetches the
 * real order status from the BE API as the authoritative source of truth.
 *
 * Data flow: Hook -> Service -> API -> axiosInstance
 * No direct API calls from page components.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchOrderDetail } from '../services/order.service';
import type { OrderDetail } from '../types';

export type VerifiedStatus = 'success' | 'failed' | 'cancelled' | 'unknown';

interface UsePaymentVerificationResult {
  status: VerifiedStatus;
  orderId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function usePaymentVerification(rawOrderId: string | null): UsePaymentVerificationResult {
  const [status, setStatus] = useState<VerifiedStatus>('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    setStatus('unknown');

    try {
      const order: OrderDetail = await fetchOrderDetail(Number(id));
      const raw = order.status;

      // Map BE order status to UI payment status
      if (raw === 'PAID' || raw === 'PREPARING' || raw === 'SHIPPING_OUT' ||
          raw === 'DELIVERING_OUT' || raw === 'IN_USE' || raw === 'COMPLETED' ||
          raw === 'RETURNED' || raw === 'EXTENDING') {
        setStatus('success');
      } else if (raw === 'CANCELLED' || raw === 'DISPUTE') {
        setStatus('failed');
      } else {
        setStatus('unknown');
      }
    } catch {
      setError('Could not verify payment status.');
      setStatus('unknown');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!rawOrderId) {
      setStatus('unknown');
      return;
    }

    // If orderId is "unknown" (placeholder) → verify via API
    if (rawOrderId === 'unknown') {
      // Cannot verify without a real orderId — show unknown
      setStatus('unknown');
      return;
    }

    // If orderId looks like a real numeric id → verify via API
    const numericId = Number(rawOrderId);
    if (!isNaN(numericId) && numericId > 0) {
      verify(rawOrderId);
    } else {
      setStatus('unknown');
    }
  }, [rawOrderId, verify]);

  return { status: status as VerifiedStatus, orderId: rawOrderId, isLoading, error };
}
