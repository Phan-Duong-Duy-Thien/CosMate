/**
 * useProviderSubscribe
 * Submits a subscription request and redirects to the payment URL on success.
 */
import { useState, useCallback } from 'react';
import { subscribeProvider } from '../api/subscription.api';
import type { SubscribeRequest } from '../types';

interface UseProviderSubscribeResult {
  subscribe: (payload: SubscribeRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useProviderSubscribe(): UseProviderSubscribeResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (payload: SubscribeRequest) => {
    setLoading(true);
    setError(null);
    try {
      const paymentUrl = await subscribeProvider(payload);
      console.log('[useProviderSubscribe] paymentUrl received:', paymentUrl, typeof paymentUrl);
      if (!paymentUrl || typeof paymentUrl !== 'string' || !paymentUrl.startsWith('http')) {
        console.error('[useProviderSubscribe] invalid paymentUrl:', paymentUrl);
        setError('invalid_payment_url');
        setLoading(false);
        return;
      }
      window.location.href = paymentUrl;
    } catch (err) {
      console.error('[useProviderSubscribe] error:', err);
      setError(err instanceof Error ? err.message : 'subscribe_error');
      setLoading(false);
    }
  }, []);

  return { subscribe, loading, error };
}
