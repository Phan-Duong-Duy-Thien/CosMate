import { useEffect, useState } from 'react';
import { estimateOrderGhnFee, type GhnShippingDirection } from '../services/ghn.service';
import { isGhnConfigured } from '../api/ghn.api';
import { VI } from '@/shared/i18n/vi';

interface UseGhnShippingFeeResult {
  fee: number | null;
  loading: boolean;
  error: string | null;
  approximate: boolean;
}

export function useGhnShippingFee(
  orderId: number | null,
  direction: GhnShippingDirection
): UseGhnShippingFeeResult {
  const [fee, setFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approximate, setApproximate] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setFee(null);
      setError(null);
      setApproximate(false);
      setLoading(false);
      return;
    }

    if (!isGhnConfigured()) {
      setFee(null);
      setError(VI.provider.orders.shipModal.ghnFeeUnavailable);
      setApproximate(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setApproximate(false);

    estimateOrderGhnFee(orderId, direction)
      .then(({ fee: total, approximate: isApprox }) => {
        if (!cancelled) {
          setFee(total);
          setApproximate(isApprox);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFee(null);
          setApproximate(false);
          const msg = err instanceof Error ? err.message : '';
          const isResolveError =
            msg.includes('Không map được') || msg.includes('Thiếu phường/xã');
          setError(
            isResolveError
              ? VI.provider.orders.shipModal.shippingFeeResolveFailedHint
              : msg || VI.provider.orders.shipModal.ghnFeeUnavailable
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, direction]);

  return { fee, loading, error, approximate };
}
