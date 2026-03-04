/**
 * useSubscriptionPlans
 * Fetches active subscription plans, sorted by billingCycleMonths ascending.
 */
import { useEffect, useState } from 'react';
import { getSubscriptionPlans } from '../api/subscription.api';
import type { SubscriptionPlan } from '../types';

interface UseSubscriptionPlansResult {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
}

export function useSubscriptionPlans(): UseSubscriptionPlansResult {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlans() {
      setLoading(true);
      setError(null);
      try {
        const all = await getSubscriptionPlans();
        if (!cancelled) {
          const active = all
            .filter((p) => p.isActive)
            .sort((a, b) => a.billingCycleMonths - b.billingCycleMonths);
          setPlans(active);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'fetch_error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPlans();
    return () => {
      cancelled = true;
    };
  }, []);

  return { plans, loading, error };
}
