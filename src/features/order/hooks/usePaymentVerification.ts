/**
 * usePaymentVerification
 *
 * When PaymentResultPage lands with an orderId, this hook fetches the
 * real order status from the BE API as the authoritative source of truth.
 *
 * IMPORTANT: Fetches from /api/orders/{id} which returns costume orders by default.
 * The orderType on costume orders is 'RENT_COSTUME'. Since this hook is used
 * only for costume order payment verification, the endpoint /api/orders/{id} is
 * correct — it should not return a service order for the same numeric ID because
 * service orders have their own API (/api/service-orders/...).
 *
 * Still, we add the orderType guard as a defensive measure against future API
 * changes or if the BE ever merges the two endpoint implementations.
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

// RENT_COSTUME = costume rental orders; RENT_SERVICE = service orders
// A costume order and service order can share the same numeric ID.
// Fetching from /api/orders/{id} should return only costume orders (the BE endpoint
// is for costume orders), but we validate with orderType as a defensive measure.
const COSTUME_ORDER_TYPE = 'RENT_COSTUME';

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

      // FIX: Guard against cross-type contamination.
      // If BE ever returns a service order from /api/orders/{id}, reject it.
      if (order.orderType && order.orderType !== COSTUME_ORDER_TYPE) {
        console.warn(
          '[usePaymentVerification] Got non-costume order from /api/orders/{id}.',
          'Expected orderType=RENT_COSTUME, got:',
          order.orderType,
          '— ignoring to prevent cross-contamination.'
        );
        setError('Order type mismatch — expected costume order.');
        setStatus('unknown');
        setIsLoading(false);
        return;
      }

      console.log('[ORDER DEBUG]', {
        id: order.id,
        type: order.orderType,
        status: order.status,
      });

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
