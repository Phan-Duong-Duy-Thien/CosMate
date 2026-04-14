/**
 * Payment Return URLs
 * Centralized return URLs for different payment methods
 */

export const PAYMENT_RETURN_URLS = {
  MOMO: 'http://localhost:8080/api/payment/api/momo/return',
  VNPAY: 'http://localhost:8080/api/payment/api/vnpay/return',
  WALLET: '',
} as const;

export type PaymentMethod = 'MOMO' | 'VNPAY' | 'WALLET';

/**
 * Get return URL for a payment method
 */
export function getReturnUrl(paymentMethod: PaymentMethod): string {
  return PAYMENT_RETURN_URLS[paymentMethod] ?? '';
}
