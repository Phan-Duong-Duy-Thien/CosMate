import { useCallback, useEffect, useState } from 'react';
import { VI } from '@/shared/i18n/vi';
import * as aiTokenPlansService from '../services/aiTokenPlans.service';
import type { AiTokenPlan } from '../types';

export function useAiTokenPlansCatalog(open: boolean) {
  const [plans, setPlans] = useState<AiTokenPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiTokenPlansService.listActiveAiTokenPlans();
      setPlans(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : VI.profile.token.buyModalLoadError;
      setError(msg);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void fetchPlans();
    }
  }, [open, fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
}
