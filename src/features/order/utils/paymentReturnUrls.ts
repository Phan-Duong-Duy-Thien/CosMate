/**
 * Payment Return URLs
 * returnUrl must point to BE callback endpoints (not FE) so gateways can notify the server.
 * BE processes payment then redirects browser to FE /payment/result.
 *
 * Do not append extra query params here unless BE explicitly supports them on the callback URL.
 */
import { getApiBaseUrl } from '@/shared/config/env';

const API_BASE = getApiBaseUrl();

const MOMO_CALLBACK = `${API_BASE}/api/payment/api/momo/return`;
const VNPAY_CALLBACK = `${API_BASE}/api/payment/api/vnpay/return`;

export const PAYMENT_RETURN_URLS = {
  MOMO: MOMO_CALLBACK,
  VNPAY: VNPAY_CALLBACK,
  WALLET: '',
} as const;

export type PaymentMethod = 'MOMO' | 'VNPAY' | 'WALLET';

/**
 * Get return URL for a payment method (BE callback only)
 */
export function getReturnUrl(paymentMethod: PaymentMethod): string {
  return PAYMENT_RETURN_URLS[paymentMethod] ?? '';
}
