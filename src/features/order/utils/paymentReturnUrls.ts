/**
 * Payment Return URLs
 * Centralized return URLs for different payment methods.
 * Must point to BE callback endpoints (not FE) so gateways can notify the server.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://api.cosmate.site').replace(
  /\/+$/,
  ''
);

export const PAYMENT_RETURN_URLS = {
  MOMO: `${API_BASE}/api/payment/api/momo/return`,
  VNPAY: `${API_BASE}/api/payment/api/vnpay/return`,
  WALLET: '',
} as const;

export type PaymentMethod = 'MOMO' | 'VNPAY' | 'WALLET';

/**
 * Get return URL for a payment method
 */
export function getReturnUrl(paymentMethod: PaymentMethod): string {
  return PAYMENT_RETURN_URLS[paymentMethod] ?? '';
}
