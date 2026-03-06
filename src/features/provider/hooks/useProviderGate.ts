/**
 * useProviderGate
 * Combines verification + plans + subscribe into one hook.
 * Used by any provider page that needs to block unverified access.
 */
import { useState } from 'react';
import { useProviderVerification } from './useProviderVerification';
import { useSubscriptionPlans } from './useSubscriptionPlans';
import { useProviderSubscribe } from './useProviderSubscribe';
import { getReturnUrl } from '@/features/order/utils/paymentReturnUrls';

export function useProviderGate() {
  const verification = useProviderVerification();
  const plans = useSubscriptionPlans();
  const { subscribe, loading: subscribing, error: subscribeError } = useProviderSubscribe();

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'VNPAY' | 'MOMO' | null>(null);

  const handleSubscribe = () => {
    if (!selectedPlanId || !selectedMethod) return;
    subscribe({
      subscriptionPlanId: selectedPlanId,
      returnUrl: getReturnUrl(selectedMethod),
      paymentMethod: selectedMethod,
    });
  };

  return {
    verified: verification.verified,
    profileLoading: verification.loading,
    plans: plans.plans,
    plansLoading: plans.loading,
    plansError: plans.error,
    selectedPlanId,
    setSelectedPlanId,
    selectedMethod,
    setSelectedMethod,
    handleSubscribe,
    subscribing,
    subscribeError,
  };
}
