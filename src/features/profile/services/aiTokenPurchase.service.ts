import * as api from '../api/aiTokenPurchase.api';
import type { AiTokenPurchase, InitiateAiTokenPurchaseParams } from '../types';

function extractPaymentUrl(result: unknown): string | null {
  if (typeof result === 'string' && result.startsWith('http')) {
    return result;
  }
  if (result && typeof result === 'object' && 'paymentUrl' in result) {
    const url = (result as { paymentUrl?: string }).paymentUrl;
    if (typeof url === 'string' && url.startsWith('http')) {
      return url;
    }
  }
  return null;
}

/**
 * Initiate token purchase and redirect to payment gateway (wallet top-up / provider subscribe pattern).
 */
export async function initiateAndRedirectAiTokenPurchase(
  params: InitiateAiTokenPurchaseParams
): Promise<void> {
  const response = await api.initiateAiTokenPurchase(params);

  if (response.code !== 0) {
    throw new Error(response.message || 'Không thể tạo thanh toán');
  }

  const paymentUrl = extractPaymentUrl(response.result);
  if (!paymentUrl) {
    throw new Error('invalid_payment_url');
  }

  window.location.href = paymentUrl;
}

export async function fetchUserAiTokenPurchases(userId: number): Promise<AiTokenPurchase[]> {
  const response = await api.getUserAiTokenPurchases(userId);

  if (response.code !== 0 || !Array.isArray(response.result)) {
    throw new Error(response.message || 'Không thể tải lịch sử mua token');
  }

  return response.result;
}
