import { useCallback, useState } from 'react';
import { VI } from '@/shared/i18n/vi';
import * as aiTokenPurchaseService from '../services/aiTokenPurchase.service';
import type { AiTokenPurchase } from '../types';

export function useAiTokenPurchaseHistory(userId: number | null) {
  const [purchases, setPurchases] = useState<AiTokenPurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPurchases = useCallback(async () => {
    if (!userId) {
      setPurchases([]);
      setError(VI.common.permission.goLogin);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await aiTokenPurchaseService.fetchUserAiTokenPurchases(userId);
      setPurchases(data);
      setHasFetched(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : VI.profile.token.loadHistoryError;
      setError(msg);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const toggleHistory = useCallback(() => {
    setIsHistoryOpen((prev) => !prev);
  }, []);

  const fetchPurchasesIfNeeded = useCallback(() => {
    if (!hasFetched && !loading) {
      void fetchPurchases();
    }
  }, [fetchPurchases, hasFetched, loading]);

  return {
    purchases,
    loading,
    error,
    isHistoryOpen,
    toggleHistory,
    fetchPurchasesIfNeeded,
    refetchPurchases: fetchPurchases,
  };
}
