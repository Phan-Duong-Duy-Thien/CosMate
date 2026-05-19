import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { getReturnUrl } from '@/features/order/utils/paymentReturnUrls';
import { VI } from '@/shared/i18n/vi';
import * as aiTokenPurchaseService from '../services/aiTokenPurchase.service';
import type { TokenPaymentMethod } from '../types';

export function usePurchaseAiToken() {
  const navigate = useNavigate();
  const [purchasingPlanId, setPurchasingPlanId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const purchase = useCallback(
    async (planId: number, paymentMethod: TokenPaymentMethod) => {
      setPurchasingPlanId(planId);
      setError(null);

      try {
        const returnUrl =
          paymentMethod === 'MOMO' || paymentMethod === 'VNPAY'
            ? getReturnUrl(paymentMethod)
            : undefined;

        const result = await aiTokenPurchaseService.submitAiTokenPurchase({
          planId,
          paymentMethod,
          returnUrl,
          isMobile: false,
        });

        if (result.type === 'wallet') {
          const purchaseQuery = result.purchaseId ? `&purchaseId=${result.purchaseId}` : '';
          navigate(
            `/payment/result?context=token&status=${result.status}${purchaseQuery}`
          );
          setPurchasingPlanId(null);
          return;
        }

        if (result.type === 'gateway') {
          window.location.href = result.paymentUrl;
          return;
        }

        throw new Error(VI.profile.token.purchaseError);
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
    },
    [navigate]
  );

  return {
    purchase,
    purchasingPlanId,
    error,
    isPurchasing: purchasingPlanId !== null,
  };
}
