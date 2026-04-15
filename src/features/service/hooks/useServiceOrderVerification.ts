/**
 * useServiceOrderVerification
 *
 * Verifies service-order payment status by calling GET /api/service-orders/cosplayer/{userId}
 * (the only existing API) and finding the order by ID from the returned list.
 *
 * Data flow: Hook → service → API → axiosInstance
 * No fake API — ONLY uses existing BE contract.
 */
import { useState, useEffect, useCallback } from 'react';
import { getServiceOrdersByCosplayer } from '../api/booking.api';
import { getUserId } from '@/features/auth/services/tokenStorage';

export type VerifiedStatus = 'success' | 'failed' | 'cancelled' | 'pending' | 'unknown';

interface UseServiceOrderVerificationResult {
  status: VerifiedStatus;
  orderId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useServiceOrderVerification(
  rawOrderId: string | null
): UseServiceOrderVerificationResult {
  const [status, setStatus] = useState<VerifiedStatus>('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (id: string) => {
    const userId = getUserId();
    if (!userId) {
      setError('User not found');
      setStatus('unknown');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus('unknown');

    try {
      const orders = await getServiceOrdersByCosplayer(userId);
      console.log('[useServiceOrderVerification] orders from BE:', orders);

      console.log('[ORDERS API]', orders);
      const order = orders.find((o) => o.id === Number(id));
      console.log('[ORDER FOUND]', order);

      if (!order) {
        console.log('[useServiceOrderVerification] order not found in list — use URL hint');
        setStatus('unknown');
        return;
      }

      console.log('[FINAL STATUS]', order?.status);

      // Map BE status directly to UI payment status
      // PAID/WAITING_SERVICE_DATE/IN_SERVICE/COMPLETED → success
      // CANCELLED/DISPUTE → failed
      // UNCONFIRM/UNPAID → payment not made yet → treat as pending
      switch (order.status) {
        case 'PAID':
        case 'WAITING_SERVICE_DATE':
        case 'IN_SERVICE':
        case 'COMPLETED':
          setStatus('success');
          break;
        case 'CANCELLED':
        case 'DISPUTE':
          setStatus('failed');
          break;
        case 'UNCONFIRM':
        case 'UNPAID':
          setStatus('pending');
          break;
        default:
          setStatus('unknown');
      }
    } catch (err) {
      console.error('[useServiceOrderVerification] verification failed:', err);
      setError(null);
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

    if (rawOrderId === 'unknown') {
      setStatus('unknown');
      return;
    }

    const numericId = Number(rawOrderId);
    if (!isNaN(numericId) && numericId > 0) {
      console.log('[useServiceOrderVerification] verifying orderId:', rawOrderId);
      verify(rawOrderId);
    } else {
      setStatus('unknown');
    }
  }, [rawOrderId, verify]);

  return { status: status as VerifiedStatus, orderId: rawOrderId, isLoading, error };
}