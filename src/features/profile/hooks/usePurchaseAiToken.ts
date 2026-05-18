import { useCallback, useState } from 'react';
import { message } from 'antd';
import { getReturnUrl } from '@/features/order/utils/paymentReturnUrls';
import { VI } from '@/shared/i18n/vi';
import * as aiTokenPurchaseService from '../services/aiTokenPurchase.service';
import type { TokenPaymentMethod } from '../types';

export function usePurchaseAiToken() {
  const [purchasingPlanId, setPurchasingPlanId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const purchase = useCallback(async (planId: number, paymentMethod: TokenPaymentMethod) => {
    setPurchasingPlanId(planId);
    setError(null);

    try {
      const returnUrl = getReturnUrl(paymentMethod);
      await aiTokenPurchaseService.initiateAndRedirectAiTokenPurchase({
        planId,
        paymentMethod,
        returnUrl,
        isMobile: false,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message === 'invalid_payment_url'
          ? VI.profile.token.purchaseInvalidUrl
          : err instanceof Error
            ? err.message
            : VI.profile.token.purchaseError;

      setError(msg);
      message.error(msg);
      setPurchasingPlanId(null);
    }
  }, []);

  return {
    purchase,
    purchasingPlanId,
    error,
    isPurchasing: purchasingPlanId !== null,
  };
}
