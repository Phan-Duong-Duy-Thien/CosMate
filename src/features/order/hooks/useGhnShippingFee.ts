import { useEffect, useState } from 'react';
import { estimateOrderGhnFee, type GhnShippingDirection } from '../services/ghn.service';
import {
  GhnResponseError,
  getGhnConfigStatus,
  isGhnConfigured,
} from '../api/ghn.api';
import { VI } from '@/shared/i18n/vi';

interface UseGhnShippingFeeResult {
  fee: number | null;
  loading: boolean;
  error: string | null;
  approximate: boolean;
}

const shipModal = VI.provider.orders.shipModal;

function isGhnResponseError(err: unknown): err is GhnResponseError {
  return (
    err instanceof GhnResponseError ||
    (typeof err === 'object' &&
      err !== null &&
      (err as GhnResponseError).name === 'GhnResponseError' &&
      typeof (err as GhnResponseError).code === 'string')
  );
}

function isJsonParseLikeError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('unexpected token') ||
    lower.includes('<!doctype') ||
    lower.includes('is not valid json') ||
    lower.includes('json.parse')
  );
}

function mapGhnFeeError(err: unknown): string {
  if (isGhnResponseError(err)) {
    switch (err.code) {
      case 'GHN_HTML_RESPONSE':
        return shipModal.ghnProxyMisconfigured;
      case 'GHN_INVALID_JSON':
        return shipModal.ghnFeeUnavailable;
      case 'GHN_HTTP_ERROR':
      case 'GHN_API_ERROR':
        return isJsonParseLikeError(err.message)
          ? shipModal.ghnFeeUnavailable
          : err.message || shipModal.ghnFeeUnavailable;
      default:
        return shipModal.ghnFeeUnavailable;
    }
  }

  if (err instanceof Error) {
    const msg = err.message;
    if (msg === 'GHN_NOT_CONFIGURED') {
      return shipModal.ghnConfigMissing;
    }
    if (msg.includes('Không map được') || msg.includes('Thiếu phường/xã')) {
      return shipModal.shippingFeeResolveFailedHint;
    }
    if (err.name === 'SyntaxError' || isJsonParseLikeError(msg)) {
      return shipModal.ghnProxyMisconfigured;
    }
    if (msg) {
      return msg;
    }
  }

  return shipModal.ghnFeeUnavailable;
}

function configStatusMessage(status: ReturnType<typeof getGhnConfigStatus>): string {
  switch (status) {
    case 'missing_credentials':
      return shipModal.ghnConfigMissing;
    case 'proxy_misconfigured':
      return shipModal.ghnProxyMisconfigured;
    default:
      return shipModal.ghnFeeUnavailable;
  }
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
      setError(configStatusMessage(getGhnConfigStatus()));
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
          setError(mapGhnFeeError(err));
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
