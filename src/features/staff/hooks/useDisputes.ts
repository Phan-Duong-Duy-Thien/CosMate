import { useState, useCallback, useEffect } from 'react';
import * as disputeService from '../services/dispute.service';
import type { Dispute, GetDisputesParams } from '@/features/order/api/dispute.api';

interface UseDisputesResult {
  disputes: Dispute[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDisputes(params?: GetDisputesParams): UseDisputesResult {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await disputeService.getDisputes(params);
      console.log('[DISPUTES]', result);
      setDisputes(result);
    } catch (err) {
      console.error('Failed to fetch disputes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { disputes, loading, error, refetch };
}
